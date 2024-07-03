import './styles/index.css'

import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { Toaster } from './components/ui/@core/sonner'
import { QueryClientProvider } from './providers/query-client-provider'
import RouterProvider from './providers/router-provider'
import { ThemeProvider } from './providers/theme-provider'
import { i18n } from './i18n'
import reportWebVitals from './report-web-vitals.ts'

ReactDOM.createRoot(document.getElementById('root')).render(
	<QueryClientProvider>
		<I18nextProvider i18n={i18n}>
			<ThemeProvider>
				<RouterProvider />
				<Toaster position='bottom-right' />
			</ThemeProvider>
		</I18nextProvider>
	</QueryClientProvider>
)

reportWebVitals()
