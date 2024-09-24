import { cn } from '@/common/utils/cn'
import { buttonVariants, Icon, Popover, PopoverContent, PopoverTrigger, Typography } from '@/components/ui'
import React from 'react'

type Props = {}

const Notification: React.FC = (props: Props) => {
	return (
		<Popover>
			<PopoverTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
				<Icon name='Bell' />
			</PopoverTrigger>
			<PopoverContent
				side='bottom'
				align='end'
				sideOffset={16}
				className='grid h-full max-h-80 min-h-64 place-content-center'>
				<Typography variant='small' color='muted' className='flex items-center justify-center gap-x-2'>
					<Icon name='Inbox' />
					Empty
				</Typography>
			</PopoverContent>
		</Popover>
	)
}

export default Notification
