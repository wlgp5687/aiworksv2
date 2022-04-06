const dotenv = require('dotenv');
const ssm = require('aws-param-env');

// azure lamda ssm 설정불러오기 필요
const env = process.env.NODE_ENV || 'development';

module.exports = {
	apps: [
		{
			name: 'aiworks_2.0',
			script: env === 'production' ? './dist/index.js' : './src/index.js',
			watch: env === 'development' ? './src' : false,
			watch_options: { followSymlinks: false, usePolling: true },
			max_memory_restart: '300M',
			log_date_format: 'YYYY-MM-DD HH:mm Z',
			error_file: 'err.log',
			out_file: env === 'development' ? 'out.log' : '/dev/null',
			source_map_support: env === 'development',
			interpreter_args: env === 'development' ? '-r @babel/polyfill -r @babel/register --trace-warnings' : '',
		},
	],
};
