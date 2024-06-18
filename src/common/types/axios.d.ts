export module 'axios' {
	interface AxiosInstance {
		getLocale: () => Locale
		getUser: () => PartialIUser | null | undefined
		getUserCompany: () => string | null | undefined
		getAccessToken: () => string
		setAccessToken: (token: string) => void
		logout: () => void
	}
}
