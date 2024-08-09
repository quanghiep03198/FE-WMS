import env from '@/common/utils/env'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Icon } from '../ui'

export default function NetworkDetector() {
	const toastRef = useRef<string | number | null>(null)

	const { data, isSuccess, isError } = useQuery({
		queryKey: ['NETWORK_HEALTH_CHECK'],
		queryFn: async () => axios.get(env('VITE_CHECKING_NETWORK_URL')),
		refetchInterval: 10_000 // Checking internet connection every 10 seconds
	})
	useEffect(() => {
		console.log(isError)
		if (isError) {
			console.log(1)
			toastRef.current = toast.error('Network error', {
				icon: <Icon name='WifiOff' stroke='hsl(var(--foreground))' />,
				description: 'You are currently offline.',
				duration: Infinity
			})
		}
		if (isSuccess)
			toast.success('You are back to online.', {
				id: toastRef.current,
				icon: <Icon name='Wifi' stroke='hsl(var(--foreground))' />,
				duration: 5000
			})
	}, [isError, isSuccess])

	return null
}
