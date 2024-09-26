/* eslint-disable no-undef */
module.exports = {
	apps: [
		{
			name: 'wms-client',
			script: 'serve',
			args: '-s build',
			env: {
				PM2_SERVE_PATH: './dist',
				PM2_SERVE_PORT: 3000,
				PM2_SERVE_SPA: true,
				PM2_SERVE_HOMEPAGE: '/index.html'
			},
			env_production: {
				NODE_ENV: 'production'
			}
		}
	]
}
