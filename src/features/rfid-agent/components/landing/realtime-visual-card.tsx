import { cn } from '@common/utils/cn'
import RealtimeCursors from '@components/motions/realtime-cursor'
import { Icon } from '@components/ui/icon'
import React from 'react'
import { VisualCard } from './visual-card'

interface RealtimeVisualProps {
	className?: string
}

const RealtimeVisualCard: React.FC<RealtimeVisualProps> = () => {
	return (
		<VisualCard.Wrapper className={cn('overflow-hidden')}>
			<VisualCard.Header>
				<VisualCard.Title>
					<Icon name='MousePointerClick' /> Realtime
				</VisualCard.Title>
				<VisualCard.Description>
					<span className='text-foreground'>RFID Reader interaction</span>
					<br />
					with real-time signal, data synchronization
				</VisualCard.Description>
			</VisualCard.Header>
			<VisualCard.Content>
				<RealtimeCursors />
			</VisualCard.Content>
		</VisualCard.Wrapper>
	)
}

export default RealtimeVisualCard
