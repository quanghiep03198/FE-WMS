import './styles/index.css'

import * as Sentry from '@sentry/react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './__app.tsx'
import env from './common/utils/env.ts'
import { router } from './providers/router-provider.tsx'
import reportWebVitals from './report-web-vitals.ts'

const runtimeEnvironment = env<RuntimeEnvironment>('VITE_NODE_ENV')

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

	debug: runtimeEnvironment === 'development',
	tracesSampleRate: 1.0, //  Capture 100% of the transactions
	tracePropagationTargets: ['localhost', env('VITE_APP_HOST'), env('VITE_API_BASE_URL')],
	replaysSessionSampleRate: runtimeEnvironment === 'production' ? 0.1 : 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
	replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

const container = document.getElementById('root')

createRoot(container, {
	onRecoverableError: (error) => {
		Sentry.captureException(error)
	}
}).render(<App />)

registerSW({ immediate: true })
reportWebVitals()
