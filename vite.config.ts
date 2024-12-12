/// <reference types="vitest" />
/// <reference types="vite/client" />

import { TanStackRouterVite as reactRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv, ViteDevServer } from 'vite'
import { VitePWA as pwa } from 'vite-plugin-pwa'

/**
 * @see https://vitejs.dev/config/
 */

export default defineConfig(({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

	return {
		plugins: [
			react(),
			reactRouter(),
			pwa({
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
				workbox: {
					runtimeCaching: [
						{
							urlPattern: /.*\.(js|css|png|jpg|svg|woff2?)$/,
							handler: 'CacheFirst',
							options: {
								cacheName: 'static-cache',
								expiration: {
									maxEntries: 50,
									maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
								}
							}
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
		envDir: '.',
		test: {
			globals: true,
			setupFiles: './tests/setup.ts',
			environment: 'jsdom',
			reporters: ['default', 'html'],
			dir: './tests',
			coverage: {
				ignoreEmptyLines: true
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
			},
			headers: {
				['Content-Security-Policy']:
					"script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'self' 'unsafe-inline'; frame-ancestors 'self'",
				['Cache-Control']: 'public, max-age=604800, immutable' // 1 week in seconds
			},
			configureServer: (server: ViteDevServer) => {
				server.middlewares.use((_, res, next) => {
					console.log('middleware triggered')
					next()
				})
			}
		},
		preview: {
			port: mode === 'test' ? 5000 : 4000,
			host: true
		},
		build: {
			emptyOutDir: true,
			sourcemap: false,
			cssCodeSplit: true,
			reportCompressedSize: true,
			chunkSizeWarningLimit: 1024,
			rollupOptions: {
				output: {
					manualChunks(id: string) {
						const modules = new Map<string, RegExp>([
							['ahooks', /ahooks/],
							['axios', /axios/],
							['@dnd-kit/modifiers', /dnd-kit/],
							['@dnd-kit/sortable', /dnd-kit/],
							['@radix-ui', /@radix-ui/],
							['@tanstack/react-query', /react-query/],
							['@tanstack/react-router', /react-router/],
							['@tanstack/react-table', /react-table/],
							['@tanstack/react-virtual', /react-virtual/],
							['clsx', /clsx/],
							['cmdk', /cmdk/],
							['copy-to-clipboard', /copy-to-clipboard/],
							['d3-shape', /d3-shape/],
							['date-fns', /date-fns/],
							['flat', /flat/],
							['immer', /immer/],
							['i18next', /i18next/],
							['lodash', /lodash/],
							['lucide', /lucide-react/],
							['lz-string', /lz-string/],
							['nprogress', /nprogress/],
							['qs', /qs/],
							['react-day-picker', /react-day-picker/],
							['react-hook-form', /react-hook-form/],
							['react-resizable-panels', /react-resizable-panels/],
							['recharts', /recharts/],
							['sonner', /sonner/],
							['tailwind-merge', /tailwind-merge/],
							['uuid', /uuid/],
							['zustand', /zustand/],
							['bcryptjs-react', /bcryptjs-react/],
							['zod', /zod/]
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
