import RouterProvider from '@/components/providers/router-provider'
import { I18nextProvider } from 'react-i18next'
import { AuthProvider } from './components/providers/auth-provider'
import { QueryClientProvider } from './components/providers/query-client-provider'
import { ThemeProvider } from './components/providers/theme-provider'
import { Toaster } from './components/ui/@shadcn/sonner'
import { i18n } from './i18n'

export default function App() {
	return (
		<QueryClientProvider>
			<I18nextProvider i18n={i18n}>
				<ThemeProvider>
					<AuthProvider>
						<RouterProvider />
					</AuthProvider>
					<Toaster position='bottom-right' />
				</ThemeProvider>
			</I18nextProvider>
		</QueryClientProvider>
	)
}
