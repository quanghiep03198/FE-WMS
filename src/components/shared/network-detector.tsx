import { useEffect, useRef } from 'react'
import { Detector } from 'react-detect-offline'
import { toast } from 'sonner'
import { Icon } from '../ui'

type NetworkDetectorProps = { online: boolean }

export default function NetworkDetector() {
	return <Detector render={(props: NetworkDetectorProps) => <NetworkNotification {...props} />} />
}

function NetworkNotification({ online }: NetworkDetectorProps) {
	const id = useRef<string | number | null>(null)

	useEffect(() => {
		if (!online)
			id.current = toast.error('Network error', {
				icon: <Icon name='WifiOff' stroke='hsl(var(--destructive-foreground))' />,
				description: 'You are currently offline.',
				duration: Infinity
			})
		else
			toast.info('You are back to online', {
				icon: <Icon name='Wifi' />,
				id: id.current,
				description: null,
				duration: 2000
			})
	}, [online])

	return null
}
