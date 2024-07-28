// @ts-nocheck
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

	return {
		plugins: [TanStackRouterVite(), react(), visualizer()],
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
						if (id.includes('router-provider')) {
							return 'router-provider'
						}
						if (id.includes('react-router')) {
							return '@tanstack/react-router'
						}
						if (id.includes('react-table')) {
							return '@tanstack/react-table'
						}
						if (id.includes('react-virtual')) {
							return '@tanstack/react-virtual'
						}
						if (id.includes('@radix-ui')) {
							return '@radix-ui'
						}
						if (id.includes('react-query')) {
							return '@tanstack/react-query'
						}
						if (id.includes('lucide-react')) {
							return 'lucide-react'
						}
						if (id.includes('ahooks')) {
							return 'ahooks'
						}
						if (id.includes('zustand')) {
							return 'zustand'
						}
						if (id.includes('lodash')) {
							return 'lodash'
						}
						if (id.includes('recharts')) {
							return 'recharts'
						}
					}
				}
			}
		}
	}
})
