import { HttpStatusCode } from 'axios'
// import './tiptap'

export declare global {
	interface InternalImportMetaEnv {
		// * Application
		readonly VITE_NODE_ENV: RuntimeEnvironment
		readonly VITE_APP_PORT: string
		readonly VITE_APP_HOST: string
		readonly VITE_APP_VERSION: string

		readonly VITE_LIANYING_APP_HOST: string
		readonly VITE_LIANSHUN_APP_HOST: string
		readonly VITE_KHRU_APP_HOST: string
		// * Backend
		readonly VITE_API_BASE_URL: string
		readonly VITE_WEBSOCKET_URL: string
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
		stack?: string
		timestamp: Date
	}

	type WsResponseBody<T> = {
		event: string
		ok: boolean
		error: null | string | object
		metadata: T
	}

	type Pagination<T = unknown> = {
		data: Array<T>
		hasNextPage: boolean
		hasPrevPage: boolean
		limit: number
		page: number
		totalDocs: number
		totalPages: number
		nextPage: number | null
		prevPage: number | null
	}
	type Locale = 'vi' | 'en' | 'cn'

	type Bit = 0 | 1

	type AnonymousFunction = (...args: any[]) => any

	type RowDeletionType = 'single' | 'multiple' | undefined

	type FirstParameter<T> = T extends (first: infer FirstArgument, ...args: any[]) => any ? FirstArgument : never

	type Parameter<T> = T extends (param: infer Argument) => any ? Argument : never
}
