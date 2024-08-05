import { HttpStatusCode } from 'axios'

export declare global {
	interface InternalImportMetaEnv {
		readonly VITE_NODE_ENV: string
		readonly VITE_APP_VERSION: string
		readonly VITE_API_BASE_URL: string
		readonly VITE_REPORT_BUG_URL: string
		readonly VITE_DEFAULT_TTL: string
		readonly VITE_REQUEST_TIMEOUT: string
		readonly VITE_TEST_DB_HOST: string
		readonly VITE_PRODUCTION_DB_HOST: string
		readonly VITE_KM_DB_HOST_01: string
		readonly VITE_KM_DB_HOST_02: string
		readonly VITE_VN_DB_HOST_01: string
		readonly VITE_VN_DB_HOST_02: string
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
