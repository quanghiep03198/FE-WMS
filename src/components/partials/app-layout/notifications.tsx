import { cn } from '@common/utils/cn'
import { Typography } from '@components/customs/typography'
import { buttonVariants } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import React from 'react'

const Notification: React.FC = () => {
	return (
		<Popover>
			<PopoverTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
				<Icon name='Bell' />
			</PopoverTrigger>
			<PopoverContent
				align='end'
				className='grid h-full max-h-80 min-h-64 place-content-center'
				side='bottom'
				sideOffset={16}>
				<Typography className='flex items-center justify-center gap-x-2' color='muted' variant='small'>
					<Icon className='size-6' name='Inbox' strokeWidth={1.5} />
					Empty
				</Typography>
			</PopoverContent>
		</Popover>
	)
}

export default Notification
