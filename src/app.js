import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import connectRedis from 'connect-redis';
import redis from 'redis';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import permission from 'permission';
import csrf from 'csurf';
import { logger, errorLogger } from './services/logger';
import morgan from 'morgan';

// router
import router from './routes/router';
import { sequelize } from './database';
import { handleNotFound, handleRender, handleUncaught } from './routes/error';

const Sentry = require('@sentry/node');

const RedisSessionStore = connectRedis(session);
const redisClient = redis.createClient(6380, process.env.REDIS_HOST, { auth_pass: process.env.REDIS_KEY, tls: { servername: process.env.REDIS_HOST } });

const app = express();
const env = process.env.NODE_ENV || 'development';

app.use(Sentry.Handlers.requestHandler());

// security measures
app.use(helmet({ frameguard: false }));
app.set('permission', {
	after: (req, res, next, status) => {
		if (status === permission.NOT_AUTHENTICATED) return res.status(403).send('not authenticated');
		if (status === permission.NOT_AUTHORIZED) return res.status(403).send('not authorized');
		return next();
	},
});

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(
	cors({
		origin: ['http://localhost:3000', 'http://localhost:4000'],
		credentials: true,
	}),
);

app.set('trust proxy', 1);
app.use(
	session({
		secret: process.env.JWT_SECRET,
		maxAge: 1000 * 60 * 60 * 24 * 7,
		store: new RedisSessionStore({ client: redisClient }),
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false, // if true only transmit cookie over https
			httpOnly: false, // if true prevent client side JS from reading the cookie
		},
	}),
);

app.use(
	csrf({
		cookie: true,
		ignoreMethods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE', 'PATCH'],
	}),
);

// router
app.use(morgan(env !== 'production' ? 'dev' : 'tiny'));
app.use('/', router);
app.get('/debug-sentry', function mainHandler(req, res) {
	throw new Error('My first Sentry error!');
});
// error router
app.use(Sentry.Handlers.errorHandler());
app.use(handleNotFound);
if (env === 'production') app.use(errorLogger({ reportToSlack: true }));
app.use(errorLogger({ saveAsFile: true, saveAsJson: true }));
app.use(handleRender);
process.on('uncaughtException', handleUncaught(1));
process.on('SIGINT', handleUncaught(2));

const models = require('./database/index.js');

models.sequelize.sync().then(() => {
	console.log('connect');
});

export default app;
