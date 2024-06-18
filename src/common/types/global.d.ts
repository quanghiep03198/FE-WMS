import { resources } from '@/i18n/resources.i18n'
import { HttpStatusCode } from 'axios'

export declare global {
	type ResponseBody<T> = {
		message: string
		statusCode: HttpStatusCode
		metadata: T | null
	}

	type ErrorResponse = {
		data: ResponseBody<undefined>
		status: HttpStatus
	}

	type AnonymousFunction = (...args: any[]) => any

	type Locale = 'vi' | 'en' | 'cn'

	type Pagination<T = unknown> = {
		data: Array<T>
		hasNextPage: boolean
		hasPrevPage: boolean
		limit: number
		page: number
		totalDocs: number
		totalPages: number
	}

	type FirstArgumentOfAnyFunction<T> = T extends (first: infer FirstArgument, ...args: any[]) => infer T
		? FirstArgument
		: never

	interface GlobalImportMetaEnv {
		readonly VITE_NODE_ENV: string
		readonly VITE_APP_VERSION: string
		readonly VITE_API_BASE_URL: string
		readonly VITE_REPORT_BUG_URL: string
		readonly VITE_DEFAULT_TTL: string
	}
}
