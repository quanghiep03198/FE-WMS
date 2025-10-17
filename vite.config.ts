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
			rolldownOptions: {
				dropLabels: mode === 'production' ? ['console', 'debugger'] : undefined,
				logLevel: mode === 'production' ? 'silent' : 'debug',
				output: {
					advancedChunks: {
						groups: [
							{ name: '@dnd-kit', test: /@dnd-kit/ },
							{ name: '@radix-ui', test: /@radix-ui/ },
							{ name: '@tanstack/react-query', test: /@tanstack\/react-query/ },
							{ name: '@tanstack/react-router', test: /@tanstack\/react-router/ },
							{ name: '@tanstack/react-table', test: /@tanstack\/react-table/ },
							{ name: '@tanstack/react-virtual', test: /@tanstack\/react-virtual/ },
							{ name: '@tiptap/core', test: /@tiptap\/core/ },
							{ name: '@tiptap/extension-color', test: /@tiptap\/extension-color/ },
							{ name: '@tiptap/extension-file-handler', test: /@tiptap\/extension-file-handler/ },
							{ name: '@tiptap/extension-gapcursor', test: /@tiptap\/extension-gapcursor/ },
							{ name: '@tiptap/extension-heading', test: /@tiptap\/extension-heading/ },
							{ name: '@tiptap/extension-highlight', test: /@tiptap\/extension-highlight/ },
							{ name: '@tiptap/extension-image', test: /@tiptap\/extension-image/ },
							{ name: '@tiptap/extension-link', test: /@tiptap\/extension-link/ },
							{ name: '@tiptap/extension-placeholder', test: /@tiptap\/extension-placeholder/ },
							{ name: '@tiptap/extension-table', test: /@tiptap\/extension-table/ },
							{ name: '@tiptap/extension-table-cell', test: /@tiptap\/extension-table-cell/ },
							{ name: '@tiptap/extension-table-header', test: /@tiptap\/extension-table-header/ },
							{ name: '@tiptap/extension-table-row', test: /@tiptap\/extension-table-row/ },
							{ name: '@tiptap/extension-text-align', test: /@tiptap\/extension-text-align/ },
							{ name: '@tiptap/extension-text-style', test: /@tiptap\/extension-text-style/ },
							{ name: '@tiptap/extension-underline', test: /@tiptap\/extension-underline/ },
							{ name: '@tiptap/pm', test: /@tiptap\/pm/ },
							{ name: '@tiptap/react', test: /@tiptap\/react/ },
							{ name: '@tiptap/starter-kit', test: /@tiptap\/starter-kit/ },
							{ name: 'ahooks', test: /ahooks/ },
							{ name: 'axios', test: /axios/ },
							{ name: 'bcryptjs-react', test: /bcryptjs-react/ },
							{ name: 'clsx', test: /clsx/ },
							{ name: 'cmdk', test: /cmdk/ },
							{ name: 'copy-to-clipboard', test: /copy-to-clipboard/ },
							{ name: 'd3-shape', test: /d3-shape/ },
							{ name: 'date-fns', test: /date-fns/ },
							{ name: 'file-saver', test: /file-saver/ },
							{ name: 'filesize', test: /filesize/ },
							{ name: 'flat', test: /flat/ },
							{ name: 'i18next', test: /i18next/ },
							{ name: 'i18next-browser-languagedetector', test: /i18next-browser-languagedetector/ },
							{ name: 'immer', test: /immer/ },
							{ name: 'lodash', test: /lodash/ },
							{ name: 'lucide', test: /lucide-react/ },
							{ name: 'lz-string', test: /lz-string/ },
							{ name: 'nprogress', test: /nprogress/ },
							{ name: 'qs', test: /qs/ },
							{ name: 'react-day-picker', test: /react-day-picker/ },
							{ name: 'react-hook-form', test: /react-hook-form/ },
							{ name: 'react-resizable-panels', test: /react-resizable-panels/ },
							{ name: 'recharts', test: /recharts/ },
							{ name: '@sentry/react', test: /@sentry\/react/ },
							{ name: 'sonner', test: /sonner/ },
							{ name: 'socket.io-client', test: /socket.io-client/ },
							{ name: 'tailwind-merge', test: /tailwind-merge/ },
							{ name: 'tailwind-styled-components', test: /tailwind-styled-components/ },
							{ name: 'uuid', test: /uuid/ },
							{ name: 'zod', test: /zod/ },
							{ name: 'zustand', test: /zustand/ }
						]
					}
				}
			}
		}
	}
})
