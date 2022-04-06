import winston from 'winston';
import expressWinston from 'express-winston';
import SlackHook from 'winston-slack-webhook-transport';
import { format } from 'date-fns';

const dynamicMeta = (req, res) => ({ jwt: res.locals.jwt || {} });

export const logger = ({ saveAsFile = false }) => {
	const transports = [new winston.transports.Console()];
	if (saveAsFile) transports.push(new winston.transports.File({ filename: format(Date.now(), 'YYYY-MM-DD-out.log'), maxsize: 1024 * 1024 }));
	return expressWinston.logger({
		transports,
		format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
		expressFormat: false,
		colorize: true,
		dynamicMeta
	});
};

export const errorLogger = ({ reportToSlack = false, saveAsFile = false, saveAsJson = false }) => {
	const transports = [saveAsFile ? new winston.transports.File({ filename: format(Date.now(), 'YYYY-MM-DD-err.log'), maxsize: 1024 * 1024 }) : new winston.transports.Console()];
	if (reportToSlack)
		transports.push(
			new SlackHook({
				webhookUrl: 'https://hooks.slack.com/services/',
				formatter: info => ({
					text: `*${info.level}: ${info.message}*`,
					attachments: [info.meta.error && info.meta.error.status ? { title: 'status', text: info.meta.error.status } : {}, { title: 'message', text: info.meta.message }]
				})
			})
		);
	const formats = [winston.format.colorize()];
	if (saveAsJson) formats.push(winston.format.json());
	return expressWinston.errorLogger({
		transports,
		format: winston.format.combine(...formats),
		expressFormat: true,
		colorize: true,
		dynamicMeta
	});
};
