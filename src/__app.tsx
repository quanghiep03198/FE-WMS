import { Suspense, lazy } from 'react'
import { I18nextProvider } from 'react-i18next'
import NetworkDetector from './components/shared/network-detector'
import { Toaster } from './components/ui/@core/sonner'
import { i18n } from './i18n'
import { QueryClientProvider } from './providers/query-client-provider'
import { ThemeProvider } from './providers/theme-provider'

const RouterProvider = lazy(() => import('./providers/router-provider'))

const App: React.FC = () => (
	<QueryClientProvider>
		<I18nextProvider i18n={i18n}>
			<ThemeProvider>
				<Suspense fallback={null}>
					<RouterProvider />
				</Suspense>
				<Toaster position='bottom-right' closeButton={true} />
				<NetworkDetector />
			</ThemeProvider>
		</I18nextProvider>
	</QueryClientProvider>
)

export default App
