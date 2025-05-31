import env from '@/common/utils/env'

export const hostRegistry: Map<string, string> = new Map([
	['VA1', env('VITE_LIANYING_APP_HOST', 'localhost')],
	['VB1', env('VITE_LIANYING_APP_HOST', 'localhost')],
	['VB2', env('VITE_LIANSHUN_APP_HOST', 'localhost')],
	['CA1', env('VITE_KHRU_APP_HOST', 'localhost')]
])
