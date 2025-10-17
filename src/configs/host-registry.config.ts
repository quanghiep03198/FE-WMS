import env from '@/common/utils/env'

/**
 * A registry mapping company codes to their respective hostnames.
 */
export const __hostRegistry: Map<string, { domain: string; ip: string }> = new Map([
	['VA1', { domain: env('VITE_LIANYING_APP_DOMAIN', 'localhost'), ip: env('VITE_LIANYING_APP_IP', 'localhost') }],
	['VB1', { domain: env('VITE_LIANYING_APP_DOMAIN', 'localhost'), ip: env('VITE_LIANYING_APP_IP', 'localhost') }],
	['VB2', { domain: env('VITE_LIANSHUN_APP_DOMAIN', 'localhost'), ip: env('VITE_LIANSHUN_APP_IP', 'localhost') }],
	['CA1', { domain: env('VITE_KHRU_APP_DOMAIN', 'localhost'), ip: env('VITE_KHRU_APP_IP', 'localhost') }]
])
