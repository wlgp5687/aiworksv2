import redis from 'redis';

const redisClient = redis.createClient(6380, process.env.REDIS_HOST, { auth_pass: process.env.REDIS_KEY, tls: { servername: process.env.REDIS_HOST } });

redisClient.on('connect', function (err) {
	console.log('Connected to redis successfully');
});

// redis key, value 저장하기
export const redisSetKeyValue = async (keyParam, valueParam) => {
	const value = JSON.stringify(valueParam);
	redisClient.set(keyParam, value);

	return null;
};

// redis key로 value 조회하기
export const redisGetValue = async (keyParam) => {
	return new Promise((resolve, reject) => {
		redisClient.get(keyParam, (err, value) => {
			if (err) return reject(err);

			return resolve(JSON.parse(value));
		});
	});
};

// redis key 삭제
export const redisDelKey = async (keyParam) => {
	redisClient.del(keyParam);

	return null;
};
