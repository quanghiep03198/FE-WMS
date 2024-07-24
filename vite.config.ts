// @ts-nocheck
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

	return {
		plugins: [react(), TanStackRouterVite()],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src')
			}
		},
		esbuild: {
			drop: ['console', 'debugger']
		},
		server: {
			port: 3000,
			host: true,
			proxy: {
				'/api': {
					target: process.env.VITE_API_BASE_URL,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, '')
				}
			}
		},
		preview: {
			port: 4000,
			host: true
		},
		build: {
			rollupOptions: {
				output: {
					manualChunks(id: string) {
						if (id.includes('node_modules')) {
							return 'vendor'
						}
					}
				}
			}
		}
	}
})
