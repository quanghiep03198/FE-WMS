import { NETWORK_CONNECTION_CHANGE } from '@components/shared/network-detector'
import { Div, Icon } from '@components/ui'
import { StatusIndicator } from '@components/ui/@custom/status-indicator'
import { useEventListener } from 'ahooks'
import { useState } from 'react'

const NetworkInsight: React.FC<React.ComponentProps<'div'>> = () => {
	const [isNetworkAvailable, setIsNetworkAvailable] = useState<boolean>(true)

	useEventListener(NETWORK_CONNECTION_CHANGE, (e: CustomEvent<boolean>) => {
		setIsNetworkAvailable(e.detail)
	})

	return (
		<Div className='relative mr-2'>
			{isNetworkAvailable ? (
				<Icon name='Server' size={18} />
			) : (
				<Icon name='ServerCrash' className='stroke-muted-foreground' size={18} />
			)}
			<StatusIndicator
				className='absolute top-0 right-0 translate-x-1 -translate-y-1'
				size='sm'
				state={isNetworkAvailable ? 'active' : 'down'}
			/>
		</Div>
	)
}

export default NetworkInsight
