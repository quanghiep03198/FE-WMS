import { Div, Typography } from '@/components/ui'
import { useInterval } from 'ahooks'
import { format } from 'date-fns'
import { useState } from 'react'

const SystemTime: React.FC = () => {
	const [currentTime, setCurrentTime] = useState(new Date())

	useInterval(
		() => {
			setCurrentTime(new Date())
		},
		1000,
		{ immediate: true }
	)

	return (
		<Div className='relative flex h-full min-h-48 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border bg-background shadow'>
			<Typography color='success' className='z-10 text-center font-medium'>
				System Time
			</Typography>
			<Typography variant='code' className='z-10 text-center text-3xl tracking-wide'>
				{format(currentTime, 'HH:mm:ss')}
			</Typography>
			<Typography color='muted' className='z-10 text-center'>
				{format(currentTime, 'MMM dd, yyyy')}
			</Typography>
		</Div>
	)
}

export default SystemTime
