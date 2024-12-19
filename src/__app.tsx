import * as Sentry from '@sentry/react'
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { ErrorBoundaryFallback } from './app/_components/_errors/-error-boundary-fallback'
import { Toaster } from './components/ui/@core/sonner'
import { AppConfigs } from './configs/app.config'
import { i18n } from './i18n'
import { QueryClientProvider } from './providers/query-client-provider'
import { RouterProvider } from './providers/router-provider'
import { ThemeProvider } from './providers/theme-provider'

const App: React.FC = () => {
	return (
		<Sentry.ErrorBoundary
			fallback={({ error, resetError, ...props }) => (
				<ErrorBoundaryFallback error={error as Error} resetError={resetError} {...props} />
			)}
			showDialog>
			<QueryClientProvider>
				<I18nextProvider i18n={i18n}>
					<ThemeProvider>
						<RouterProvider />
						<Toaster
							className='pointer-events-auto'
							position='bottom-right'
							duration={AppConfigs.TOAST_DURATION}
						/>
					</ThemeProvider>
				</I18nextProvider>
			</QueryClientProvider>
		</Sentry.ErrorBoundary>
	)
}

export default Sentry.withProfiler(App)
