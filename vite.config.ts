/// <reference types="vitest" />
/// <reference types="vite/client" />

import babel from '@rolldown/plugin-babel'
import { sentryVitePlugin as sentry } from '@sentry/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig, loadEnv, ProxyOptions } from 'vite'
import { VitePWA as pwa, type VitePWAOptions } from 'vite-plugin-pwa'
import { viteStaticCopy as staticCopy } from 'vite-plugin-static-copy'

/**
 * @see https://vite.dev/config/
 */
export default defineConfig(({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
	const apiOrigin = process.env.VITE_API_BASE_URL ? new URL(process.env.VITE_API_BASE_URL).origin : undefined

	const headers: HeadersInit = {
		['Cache-Control']: 'public, max-age=0, must-revalidate',
		['Content-Security-Policy']:
			"script-src 'self' 'unsafe-inline' 'unsafe-eval'; worker-src 'self' 'unsafe-inline' blob:; style-src 'self' 'unsafe-inline'; object-src 'self' 'unsafe-inline'; frame-ancestors 'self'",
		['Cross-Origin-Resource-Policy']: 'cross-origin',
		['Referrer-Policy']: 'strict-origin-when-cross-origin',
		['Strict-Transport-Security']: 'max-age=63072000; includeSubDomains; preload',
		['Service-Worker-Allowed']: '/',
		['X-Content-Type-Options']: 'nosniff',
		['X-Frame-Options']: 'DENY',
		['X-XSS-Protection']: '1; mode=block'
	}

	const proxy: Record<string, string | ProxyOptions> = {
		'/uploads': {
			target: apiOrigin,
			changeOrigin: true
		},
		'/files': {
			target: apiOrigin,
			changeOrigin: true
		},
		'/api': {
			target: process.env.VITE_API_BASE_URL,
			changeOrigin: true,
			rewrite: (path) => path.replace(/^\/api/, '')
		}
	}

	return {
		define: { __SENTRY_DEBUG__: false },
		devtools: {
			apply: 'build',
			build: {
				withApp: true // generate DevTools output during `vite build`
			}
		},
		resolve: {
			tsconfigPaths: true
		},
		plugins: [
			tailwindcss(),
			devtools({ removeDevtoolsOnBuild: true, consolePiping: { enabled: mode === 'development' } }),
			tanstackRouter({
				target: 'react',
				autoCodeSplitting: true
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
			pwa({
				registerType: 'autoUpdate',
				disable: mode === 'development',
				mode: mode as VitePWAOptions['mode'],
				includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
				manifest: false,
				workbox: {
					navigateFallback: '/index.html',
					navigateFallbackDenylist: [
						/^\/api\//,
						/^\/uploads\//,
						/^\/files\//,
						/^\/sw\.js$/,
						/^\/workbox-.*\.js$/,
						/\.(wasm|map)$/
					],
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
							urlPattern: /\.(?:ico|png|jpg|jpeg|svg|webp|woff2|mp4?)$/i,
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
						},
						{
							urlPattern: ({ url }) =>
								url.pathname.startsWith('/uploads/') || url.pathname.startsWith('/files/'),
							handler: 'NetworkFirst',
							options: {
								cacheName: 'uploads-cache',
								expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 }
							}
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
					disable: true,
					// * Delete sourcemap after they're uploaded to Sentry.
					filesToDeleteAfterUpload: ['./dist/**/*.map']
				}
			})
		],
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
			proxy,
			headers
		},
		preview: {
			port: mode === 'staging' ? 5000 : 4000,
			host: true,
			proxy,
			headers
		},
		build: {
			emptyOutDir: true,
			reportCompressedSize: false,
			chunkSizeWarningLimit: 500,
			assetsInlineLimit: 4096, // Inline files < 4KB
			rolldownOptions: {
				logLevel: mode === 'production' ? 'silent' : 'debug',
				output: { codeSplitting: true }
			}
		}
	}
})
