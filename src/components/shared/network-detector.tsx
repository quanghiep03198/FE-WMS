import { AppConfigs } from '@/configs/app.config'
import { useQuery } from '@tanstack/react-query'
import { useUpdateEffect } from 'ahooks'
import axios from 'axios'
import { useRef } from 'react'
import { toast } from 'sonner'
import { Icon } from '../ui'

/**
 * @event
 * Event that detects network connection is changed (online/offline)
 */
export const NETWORK_CONNECTION_CHANGE = 'NETWORK_CONNECTION_CHANGE' as const

export const NETWORK_HEALTH_CHECK = 'NETWORK_HEALTH_CHECK'

export default function NetworkDetector() {
	const toastRef = useRef<string | number | null>(null)

	const { isSuccess, isError } = useQuery({
		queryKey: ['NETWORK_HEALTH_CHECK'],
		queryFn: async () => axios.get(AppConfigs.NETWORK_CONNECTION_HEALTH_CHECK_URL),
		refetchInterval: 1000 // Checking internet connection every 1 seconds
	})

	useUpdateEffect(() => {
		if (isError) {
			window.dispatchEvent(new CustomEvent(NETWORK_CONNECTION_CHANGE, { detail: false }))
			toastRef.current = toast.error('Network error', {
				icon: <Icon name='WifiOff' stroke='hsl(var(--foreground))' />,
				description: 'You are currently offline.',
				duration: Infinity
			})
		}
		if (isSuccess) {
			window.dispatchEvent(new CustomEvent(NETWORK_CONNECTION_CHANGE, { detail: true }))
			toast.success('You are back to online.', {
				id: toastRef.current,
				icon: <Icon name='Wifi' stroke='hsl(var(--foreground))' />
			})
		}
	}, [isError, isSuccess])

	return null
}
