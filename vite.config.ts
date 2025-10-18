/// <reference types="vitest" />
/// <reference types="vite/client" />

import { sentryVitePlugin as sentry } from '@sentry/vite-plugin'
import { TanStackRouterVite as reactRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv, normalizePath } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { VitePWA as pwa, type VitePWAOptions } from 'vite-plugin-pwa'
import { viteStaticCopy as staticCopy } from 'vite-plugin-static-copy'
/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig(({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
	normalizePath(path.resolve(__dirname, './infrastructure'))

	return {
		plugins: [
			react({
				babel: {
					plugins: [['babel-plugin-react-compiler', {}]]
				}
			}),
			reactRouter(),
			staticCopy({
				targets: [{ src: './infrastructure/web.config', dest: '' }]
			}),
			nodePolyfills(),
			pwa({
				registerType: 'autoUpdate',
				manifestFilename: 'site.webmanifest',
				disable: mode === 'development',
				mode: mode as VitePWAOptions['mode'],
				includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
				manifest: {
					name: 'Warehouse Management System',
					short_name: 'WMS',
					description: 'Production warehouse management system',
					start_url: '/login',
					display: 'fullscreen',
					theme_color: '#262626',
					orientation: 'landscape-primary',
					screenshots: [
						{
							src: 'logo.svg',
							sizes: '64x64',
							type: 'image/svg+xml'
						}
					],
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
					navigateFallback: '/index.html',
					navigateFallbackDenylist: [/^\/api\//, /^\/sw\.js$/, /^\/workbox-.*\.js$/, /\.(wasm|map)$/],
					globPatterns: ['**/*.{html,css,ico,png,jpg,svg,webp,woff2}'],
					skipWaiting: true,
					clientsClaim: true,
					navigationPreload: true,
					runtimeCaching: [
						{
							// Handle versioned JS files (from build)
							urlPattern: /.*\.(js|mjs)$/,
							handler: 'StaleWhileRevalidate',
							options: {
								cacheName: 'js-cache',
								expiration: {
									maxEntries: 100,
									maxAgeSeconds: 60 * 60 * 24, // 24 hours
									purgeOnQuotaError: true
								},
								cacheableResponse: {
									statuses: [0, 200]
								}
							}
						},
						{
							// Handle CSS and other resources
							urlPattern: /.*\.(html|css|json|wasm)$/,
							handler: 'StaleWhileRevalidate',
							options: {
								cacheName: 'resources-cache',
								expiration: {
									maxEntries: 200,
									maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
									purgeOnQuotaError: true
								},
								cacheableResponse: {
									statuses: [0, 200]
								}
							}
						},
						{
							// Static assets - longer cache
							urlPattern: /.*\.(ico|png|jpg|svg|webp|woff2?)$/,
							handler: 'CacheFirst',
							options: {
								cacheName: 'static-cache',
								expiration: {
									maxEntries: 50,
									maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
								}
							}
						},
						{
							// API calls
							urlPattern: ({ url }) => url.pathname.startsWith('/api'),
							handler: 'NetworkOnly'
						}
					],
					cleanupOutdatedCaches: true,
					mode: 'production'
				},
				devOptions: {
					enabled: false,
					type: 'module',
					suppressWarnings: true,
					navigateFallback: '/index.html'
				}
			}),
			sentry({
				authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
				org: process.env.VITE_SENTRY_ORG,
				project: process.env.VITE_SENTRY_PROJECT,
				telemetry: mode === 'production'
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
		optimizeDeps: {
			esbuildOptions: {
				target: 'esnext'
			}
		},
		esbuild: {
			drop: mode === 'production' ? ['console', 'debugger'] : undefined,
			logOverride: {
				'this-is-undefined-in-esm': 'silent'
			}
		},
		server: {
			port: 3000,
			host: true,
			proxy: {
				'/api': {
					target: process.env.VITE_API_BASE_URL,
					changeOrigin: true,
					secure: false, // * Accept self-signed cert
					rewrite: (path) => path.replace(/^\/api/, '')
				}
			}
			// headers: {
			// 	['Content-Security-Policy']:
			// 		"script-src 'self' 'unsafe-inline' 'unsafe-eval'; worker-src 'self' 'unsafe-inline' blob:; style-src 'self' 'unsafe-inline'; object-src 'self' 'unsafe-inline'; frame-ancestors 'self'",
			// 	['Strict-Transport-Security']: 'max-age=63072000; includeSubDomains; preload',
			// 	['Cross-Origin-Resource-Policy']: 'cross-origin'
			// }
		},
		preview: {
			port: mode === 'test' ? 5000 : 4000,
			host: true
		},
		build: {
			emptyOutDir: true,
			sourcemap: true,
			cssCodeSplit: true,
			reportCompressedSize: true,
			chunkSizeWarningLimit: 1024,
			rollupOptions: {
				onwarn(warning, warn) {
					if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
						return
					}
					warn(warning)
				},

				output: {
					manualChunks(id: string) {
						const modules = new Array<[string, RegExp]>(
							['@dnd-kit', /@dnd-kit\/*/],
							['@radix-ui', /@radix-ui\/*/],
							['@tanstack/react-query', /@tanstack\/react-query/],
							['@tanstack/react-router', /@tanstack\/react-router/],
							['@tanstack/react-table', /@tanstack\/react-table/],
							['@tanstack/react-virtual', /react-virtual/],
							['@tiptap/core', /@tiptap\/core/],
							['@tiptap/extension-color', /@tiptap\/extension-color/],
							['@tiptap/extension-file-handler', /@tiptap\/extension-file-handler/],
							['@tiptap/extension-gapcursor', /@tiptap\/extension-gapcursor/],
							['@tiptap/extension-heading', /@tiptap\/extension-heading/],
							['@tiptap/extension-highlight', /@tiptap\/extension-highlight/],
							['@tiptap/extension-image', /@tiptap\/extension-image/],
							['@tiptap/extension-link', /@tiptap\/extension-link/],
							['@tiptap/extension-placeholder', /@tiptap\/extension-placeholder/],
							['@tiptap/extension-table', /@tiptap\/extension-table/],
							['@tiptap/extension-table-cell', /@tiptap\/extension-table-cell/],
							['@tiptap/extension-table-header', /@tiptap\/extension-table-header/],
							['@tiptap/extension-table-row', /@tiptap\/extension-table-row/],
							['@tiptap/extension-text-align', /@tiptap\/extension-text-align/],
							['@tiptap/extension-text-style', /@tiptap\/extension-text-style/],
							['@tiptap/extension-underline', /@tiptap\/extension-underline/],
							['@tiptap/pm', /@tiptap\/pm/],
							['@tiptap/react', /@tiptap\/react/],
							['@tiptap/starter-kit', /@tiptap\/starter-kit/],
							['ahooks', /ahooks/],
							['axios', /axios/],
							['bcryptjs-react', /bcryptjs-react/],
							['clsx', /clsx/],
							['cmdk', /cmdk/],
							['copy-to-clipboard', /copy-to-clipboard/],
							['d3-shape', /d3-shape/],
							['date-fns', /date-fns/],
							['file-saver', /file-saver/],
							['filesize', /filesize/],
							['flat', /flat/],
							['i18next', /i18next/],
							['i18next-browser-languagedetector', /i18next-browser-languagedetector/],
							['immer', /immer/],
							['lodash', /lodash/],
							['lucide', /lucide-react/],
							['lz-string', /lz-string/],
							['nprogress', /nprogress/],
							['qs', /qs/],
							['react-day-picker', /react-day-picker/],
							['react-hook-form', /react-hook-form/],
							['react-resizable-panels', /react-resizable-panels/],
							['recharts', /recharts/],
							['@sentry/react', /@sentry\/react/],
							['sonner', /sonner/],
							['socket.io-client', /socket.io-client/],
							['tailwind-merge', /tailwind-merge/],
							['tailwind-styled-components', /tailwind-styled-components/],
							['uuid', /uuid/],
							['zod', /zod/],
							['zustand', /zustand/]
						)

						for (const [key, regex] of modules) {
							if (id.match(regex)) return key
						}
						return null
					}
				}
			}
		}
	}
})
