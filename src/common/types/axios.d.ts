export module 'axios' {
	interface AxiosInstance {
		getLocale: () => Locale
		getUser: () => PartialIUser | null | undefined
		getAccessToken: () => string
		setAccessToken: (token: string) => void
		logout: () => void
	}
}
