import { HttpStatusCode } from 'axios'

export declare global {
	interface InternalImportMetaEnv {
		// * Application
		readonly VITE_NODE_ENV: RuntimeEnvironment
		readonly VITE_APP_PORT: string
		readonly VITE_APP_HOST: string
		readonly VITE_APP_VERSION: string
		// * Backend
		readonly VITE_API_BASE_URL: string
		readonly VITE_DEFAULT_TTL: number
		readonly VITE_REQUEST_TIMEOUT: number
		// * Bcrypt
		readonly VITE_BCRYPT_SALT_ROUND: number
		// * Sentry
		readonly VITE_SENTRY_PROJECT: string
		readonly VITE_SENTRY_ORG: string
		readonly VITE_SENTRY_DSN: string
		readonly VITE_SENTRY_AUTH_TOKEN: string
	}

	interface Navigator {
		connection: {
			downlink: number
			downlinkMax: number
			effectiveType: '4g' | '3g' | '2g' | 'slow-2g'
			rtt: number
			saveData: boolean
		}
	}

	type RuntimeEnvironment = 'production' | 'development' | 'test'

	type ResponseBody<T> = {
		message: string
		statusCode: HttpStatusCode
		metadata: T | null
		path: string
	}

	type Pagination<T = unknown> = {
		data: Array<T>
		hasNextPage: boolean
		hasPrevPage: boolean
		limit: number
		page: number
		totalDocs: number
		totalPages: number
	}
	type Locale = 'vi' | 'en' | 'cn'

	type AnonymousFunction = (...args: any[]) => any

	type RowDeletionType = 'single' | 'multiple' | undefined

	type FirstParameter<T> = T extends (first: infer FirstArgument, ...args: any[]) => infer T ? FirstArgument : never

	type Parameter<T> = T extends (param: infer Argument) => infer T ? Argument : never
}
