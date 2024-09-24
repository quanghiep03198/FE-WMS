import env from '@/common/utils/env'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Icon } from '../ui'

export const NETWORK_HEALTH_CHECK = 'NETWORK_HEALTH_CHECK'

export default function NetworkDetector() {
	const toastRef = useRef<string | number | null>(null)

	const { isSuccess, isError } = useQuery({
		queryKey: ['NETWORK_HEALTH_CHECK'],
		queryFn: async () => axios.get(env('VITE_CHECKING_NETWORK_URL')),
		refetchInterval: 1000 // Checking internet connection every 10 seconds
	})

	useEffect(() => {
		if (isError) {
			window.dispatchEvent(new CustomEvent('RETRIEVE_NETWORK_CONNECTION', { detail: false }))
			toastRef.current = toast.error('Network error', {
				icon: <Icon name='WifiOff' stroke='hsl(var(--foreground))' />,
				description: 'You are currently offline.',
				duration: Infinity
			})
		}
		if (isSuccess) {
			window.dispatchEvent(new CustomEvent('RETRIEVE_NETWORK_CONNECTION', { detail: true }))
			toast.success('You are back to online.', {
				id: toastRef.current,
				icon: <Icon name='Wifi' stroke='hsl(var(--foreground))' />,
				duration: 5000
			})
		}
	}, [isError, isSuccess])

	return null
}
