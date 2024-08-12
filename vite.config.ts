import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

	return {
		plugins: [
			TanStackRouterVite(),
			react(),
			VitePWA({
				registerType: 'autoUpdate',
				includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
				manifest: {
					name: 'Warehouse Management System',
					short_name: 'WMS',
					description: 'Production warehouse management system',
					start_url: '/login',
					display: 'fullscreen',
					theme_color: '#262626',
					orientation: 'landscape-primary',
					icons: [
						{
							src: 'pwa-64x64.png',
							sizes: '64x64',
							type: 'image/png'
						},
						{
							src: 'pwa-192x192.png',
							sizes: '192x192',
							type: 'image/png'
						},
						{
							src: 'pwa-512x512.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'any'
						},
						{
							src: 'maskable-icon-512x512.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'maskable'
						}
					]
				},
				devOptions: {
					enabled: true,
					suppressWarnings: true
				}
			})
		],
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
			emptyOutDir: true,
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

						// @ts-ignore
						for (const [key, regex] of modules) {
							if (id.match(regex)) return key
						}
					}
				}
			}
		}
	}
})
