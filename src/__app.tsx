import * as Sentry from '@sentry/react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { ErrorBoundaryFallback } from './app/-components/-errors/error-boundary-fallback'
import { Toaster } from './components/ui/@core/sonner'
import { AppConfigs } from './configs/app.config'
import { i18n } from './i18n'
import { QueryClientProvider } from './providers/query-client-provider'

import { useRegisterSW } from 'virtual:pwa-register/react'
import { RouterProvider } from './providers/router-provider'
import { ThemeProvider } from './providers/theme-provider'

const App: React.FC = () => {
	const serviceWorker = useRegisterSW({ immediate: true })

	return (
		<QueryErrorResetBoundary>
			{({ reset: resetQueryError }) => (
				<Sentry.ErrorBoundary
					fallback={({ error, resetError, ...props }) => (
						<ErrorBoundaryFallback
							error={error as Error}
							resetError={() => {
								resetQueryError()
								resetError()
							}}
							{...props}
						/>
					)}
					showDialog={true}>
					<QueryClientProvider>
						<I18nextProvider i18n={i18n}>
							<ThemeProvider>
								<RouterProvider context={{ serviceWorker }} />
								<Toaster
									className='pointer-events-auto'
									position='bottom-right'
									duration={AppConfigs.TOAST_DURATION}
								/>
							</ThemeProvider>
						</I18nextProvider>
					</QueryClientProvider>
				</Sentry.ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	)
}

export default Sentry.withProfiler(App)
