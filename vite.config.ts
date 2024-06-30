// @ts-nocheck
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
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
				target: 'http://10.30.0.19:3000/api',
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
					// creating a chunk to react routes deps. Reducing the vendor chunk size
					if (id.includes('react-router')) {
						return '@tanstack/react-router'
					}
				}
			}
		}
	}
})
