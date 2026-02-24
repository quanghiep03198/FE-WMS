import './styles/index.css'

import * as Sentry from '@sentry/react'
import { createRoot } from 'react-dom/client'
import { scan } from 'react-scan'
import App from './__app.tsx'
import env from './common/utils/env.ts'
import { router } from './providers/router-provider.tsx'
import reportWebVitals from './report-web-vitals.ts'

// Runtime Environment Detection
const runtimeEnvironment = env<RuntimeEnvironment>('VITE_NODE_ENV')

const isProduction = runtimeEnvironment === 'production'
const isDevelopment = runtimeEnvironment === 'development'

// React Scan Initialization
scan({ enabled: isDevelopment })

// Sentry Initialization
Sentry.init({
	dsn: env('VITE_SENTRY_DSN'),
	integrations: [
		Sentry.tanstackRouterBrowserTracingIntegration(router, {}),
		Sentry.browserTracingIntegration({ instrumentNavigation: false }),
		Sentry.replayIntegration()
	],
	beforeSend(event) {
		if (event.exception) Sentry.captureException(event.exception)
		return event
	},
	enabled: isProduction,
	tracesSampleRate: 1.0, //  Capture 100% of the transactions
	tracePropagationTargets: [env('VITE_APP_DOMAIN')],
	replaysSessionSampleRate: isProduction ? 0.1 : 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
	replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

// Global handler for stale JS chunk 404s that occur before the router is initialized
// (e.g. dynamic imports triggered during app bootstrap after a new deployment)
const CHUNK_RELOAD_KEY = 'chunk-reload-retry'
window.addEventListener('unhandledrejection', (event) => {
	const error = event.reason
	if (!(error instanceof Error)) return
	const message = error.message.toLowerCase()
	const isChunkError =
		message.includes('failed to fetch dynamically imported module') ||
		message.includes('loading chunk') ||
		message.includes('loading css chunk') ||
		error.name === 'ChunkLoadError'
	if (isChunkError) {
		const lastReload = sessionStorage.getItem(CHUNK_RELOAD_KEY)
		const now = Date.now()
		if (!lastReload || now - Number(lastReload) > 10_000) {
			sessionStorage.setItem(CHUNK_RELOAD_KEY, String(now))
			window.location.reload()
		}
	}
})

// App Rendering
const container = document.getElementById('root')

createRoot(container, {
	onRecoverableError: (error) => {
		Sentry.captureException(error)
	}
}).render(<App />)

// Reporting Web Vitals
reportWebVitals()
