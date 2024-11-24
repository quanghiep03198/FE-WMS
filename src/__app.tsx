import { I18nextProvider } from 'react-i18next'
import { Toaster } from './components/ui/@core/sonner'
import { AppConfigs } from './configs/app.config'
import { i18n } from './i18n'
import { QueryClientProvider } from './providers/query-client-provider'
import { RouterProvider } from './providers/router-provider'
import { ThemeProvider } from './providers/theme-provider'

const App: React.FC = () => {
	return (
		<QueryClientProvider>
			<I18nextProvider i18n={i18n}>
				<ThemeProvider>
					<RouterProvider />
					<Toaster className='pointer-events-auto' position='bottom-right' duration={AppConfigs.TOAST_DURATION} />
				</ThemeProvider>
			</I18nextProvider>
		</QueryClientProvider>
	)
}

export default App
