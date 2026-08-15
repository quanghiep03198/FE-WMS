/// <reference types="vitest" />
/// <reference types="vite/client" />

import babel from '@rolldown/plugin-babel'
import { sentryVitePlugin as sentry } from '@sentry/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
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
	normalizePath(path.resolve(import.meta.dirname, './infrastructure'))

	return {
		resolve: {
			tsconfigPaths: true,
			alias: {
				'@': path.resolve(import.meta.dirname, './src')
			}
		},
		plugins: [
			tailwindcss(),
			devtools({ removeDevtoolsOnBuild: true, consolePiping: { enabled: mode === 'development' } }),
			tanstackRouter({
				target: 'react'
			}),
			react(),
			babel({ presets: [reactCompilerPreset()] }),
			staticCopy({
				targets: [
					{
						src: './infrastructure/*',
						dest: '' // * Copy all files from infrastructure to dist root
					}
				]
			}),
			nodePolyfills(),
			pwa({
				registerType: 'autoUpdate',
				disable: mode === 'development',
				mode: mode as VitePWAOptions['mode'],
				includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
				manifest: false,
				workbox: {
					navigateFallback: '/index.html',
					navigateFallbackDenylist: [/^\/api\//, /^\/sw\.js$/, /^\/workbox-.*\.js$/, /\.(wasm|map)$/],
					globPatterns: ['**/*.{html,css,js,ico,png,jpg,svg,webp,woff2}'],
					maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 3 MiB
					skipWaiting: true,
					clientsClaim: true,
					navigationPreload: true,
					runtimeCaching: [
						{
							// Hashed assets under /assets/ are already precached, but this ensures
							// any dynamically loaded chunks are also cached with CacheFirst
							urlPattern: ({ url }) => url.pathname.startsWith('/assets/'),
							handler: 'CacheFirst',
							options: {
								cacheName: 'assets-cache',
								expiration: {
									maxEntries: 500,
									maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year (hashed filenames)
									purgeOnQuotaError: true
								},
								cacheableResponse: {
									statuses: [0, 200]
								}
							}
						},
						{
							// Static resources in root (favicon, icons, images) - not hashed, use StaleWhileRevalidate
							urlPattern: /\.(?:ico|png|jpg|jpeg|svg|webp|woff2?)$/i,
							handler: 'StaleWhileRevalidate',
							options: {
								cacheName: 'static-resources-cache',
								expiration: {
									maxEntries: 500,
									maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
									purgeOnQuotaError: true
								},
								cacheableResponse: {
									statuses: [0, 200]
								}
							}
						},
						{
							// API calls - never cache
							urlPattern: ({ url }) => url.pathname.startsWith('/api'),
							handler: 'NetworkFirst',
							options: { cacheName: 'wms-api-cache' }
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
				telemetry: false,
				sourcemaps: {
					// * Delete sourcemap after they're uploaded to Sentry.
					filesToDeleteAfterUpload: ['./dist/**/*.map']
				}
			})
		],
		oxc: {
			inject: {
				Buffer: ['vite-plugin-node-polyfills/shims/buffer', 'default']
			},
			include: ['buffer', 'zlib']
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
			},
			headers: {
				['Cache-Control']: 'public, max-age=0, must-revalidate',
				['Content-Security-Policy']:
					"script-src 'self' 'unsafe-inline' 'unsafe-eval'; worker-src 'self' 'unsafe-inline' blob:; style-src 'self' 'unsafe-inline'; object-src 'self' 'unsafe-inline'; frame-ancestors 'self'",
				['Strict-Transport-Security']: 'max-age=63072000; includeSubDomains; preload',
				['Cross-Origin-Resource-Policy']: 'cross-origin',
				['X-Content-Type-Options']: 'nosniff',
				['X-Frame-Options']: 'DENY',
				['X-XSS-Protection']: '1; mode=block'
			}
		},
		preview: {
			port: mode === 'test' ? 5000 : 4000,
			host: true,
			headers: {
				['Cache-Control']: 'public, max-age=0, must-revalidate',
				['X-Content-Type-Options']: 'nosniff',
				['X-Frame-Options']: 'DENY',
				['X-XSS-Protection']: '1; mode=block'
			}
		},
		build: {
			emptyOutDir: true,
			sourcemap: true,
			cssCodeSplit: true,
			reportCompressedSize: false,
			chunkSizeWarningLimit: 500,
			assetsInlineLimit: 4096, // Inline files < 4KB
			rolldownOptions: {
				transform: { dropLabels: ['DEV', 'DEBUG'] },
				logLevel: mode === 'production' ? 'silent' : 'debug',
				output: {
					codeSplitting: {
						groups: [
							{ name: '@dnd-kit', test: /@dnd-kit/ },
							{ name: '@radix-ui', test: /@radix-ui/ },
							{ name: '@tiptap', test: /@tiptap/ },
							{ name: 'ahooks', test: /ahooks/ },
							{ name: 'axios', test: /axios/ },
							{ name: 'bcryptjs-react', test: /bcryptjs-react/ },
							{ name: 'buffer', test: /buffer/ },
							{ name: 'clsx', test: /clsx/ },
							{ name: 'color', test: /color/ },
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
							{ name: 'lodash-es', test: /lodash-es/ },
							{ name: 'lucide', test: /lucide-react/ },
							{ name: 'lz-string', test: /lz-string/ },
							{ name: 'nprogress', test: /nprogress/ },
							{ name: 'qs', test: /qs/ },
							{ name: 'react-day-picker', test: /react-day-picker/ },
							{ name: 'react-hook-form', test: /react-hook-form/ },
							{ name: 'react-resizable-panels', test: /react-resizable-panels/ },
							{ name: 'recharts', test: /recharts/ },
							{ name: '@sentry', test: /@sentry/ },
							{ name: 'sonner', test: /sonner/ },
							{ name: 'socket.io-client', test: /socket.io-client/ },
							{ name: 'tailwind-merge', test: /tailwind-merge/ },
							{ name: 'tailwind-styled-components', test: /tailwind-styled-components/ },
							{ name: 'signature_pad', test: /signature_pad/ },
							{ name: 'uuid', test: /uuid/ },
							{ name: 'zod', test: /zod/ },
							{ name: 'zustand', test: /zustand/ },
							{ name: 'zlib', test: /zlib/ }
						]
					}
				}
			}
		}
	}
})
