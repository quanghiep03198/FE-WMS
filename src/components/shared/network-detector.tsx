import { AppConfigs } from '@/configs/app.config'
import { useInterval } from 'ahooks'
import axios, { AxiosError } from 'axios'
import { useRef } from 'react'
import { toast } from 'sonner'
import { Icon } from '../ui'

/**
 * @event
 * Event that detects network connection is changed (online/offline)
 */
export const NETWORK_CONNECTION_CHANGE = 'NETWORK_CONNECTION_CHANGE' as const

export default function NetworkDetector() {
	const toastRef = useRef<string | number | null>(null)
	const statusRef = useRef<'success' | 'error'>(null)

	useInterval(
		() => {
			axios
				.get(AppConfigs.NETWORK_CONNECTION_HEALTH_CHECK_URL)
				.then(() => {
					window.dispatchEvent(new CustomEvent(NETWORK_CONNECTION_CHANGE, { detail: true }))
					if (statusRef.current !== 'success') {
						toastRef.current = toast.success('You are back to online.', {
							id: toastRef.current,
							icon: <Icon name='Wifi' stroke='hsl(var(--foreground))' />,
							description: null,
							duration: 2000
						})
						statusRef.current = 'success'
					}
				})
				.catch((e: AxiosError) => {
					if (e.code === AxiosError.ERR_NETWORK) {
						window.dispatchEvent(new CustomEvent(NETWORK_CONNECTION_CHANGE, { detail: false }))
						if (statusRef.current !== 'error') {
							toastRef.current = toast.error('Network error', {
								id: toastRef.current,
								icon: <Icon name='WifiOff' stroke='hsl(var(--foreground))' />,
								description: 'You are currently offline.',
								duration: 2000
							})
							statusRef.current = 'error'
						}
					}
				})
		},
		5000,
		{ immediate: true }
	)

	return null
}
