import { HttpStatusCode } from 'axios'

export declare global {
	interface GlobalImportMetaEnv {
		readonly VITE_NODE_ENV: string
		readonly VITE_APP_VERSION: string
		readonly VITE_API_BASE_URL: string
		readonly VITE_REPORT_BUG_URL: string
		readonly VITE_DEFAULT_TTL: string
		readonly VITE_REQUEST_TIMEOUT: string
	}

	type ResponseBody<T> = {
		message: string
		statusCode: HttpStatusCode
		metadata: T | null
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
