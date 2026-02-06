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

// App Rendering
const container = document.getElementById('root')

createRoot(container, {
	onRecoverableError: (error) => {
		Sentry.captureException(error)
	}
}).render(<App />)

// Reporting Web Vitals
reportWebVitals()
