// @ts-nocheck
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

	return {
		plugins: [TanStackRouterVite(), react()],
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
			chunkSizeWarningLimit: 1024,
			rollupOptions: {
				output: {
					manualChunks(id: string) {
						const modules = new Map([
							['@tanstack/react-router', /react-router/],
							['@tanstack/react-table', /react-table/],
							['@tanstack/react-virtual', /react-virtual/],
							['@radix-ui', /@radix-ui/],
							['@tanstack/react-query', /react-query/],
							['date-fns', /date-fns/],
							['react-hook-form', /react-hook-form/],
							['lucide', /lucide-react/],
							['ahooks', /ahooks/],
							['zustand', /zustand/],
							['immer', /immer/],
							['zod', /zod/],
							['lodash', /lodash/],
							['sonner', /sonner/],
							['recharts', /recharts/]
						])

						for (const [key, regex] of modules) {
							if (id.match(regex)) return key
						}
					}
				}
			}
		}
	}
})
