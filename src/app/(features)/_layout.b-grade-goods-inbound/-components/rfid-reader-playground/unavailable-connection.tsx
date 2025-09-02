import { Button, Div, Icon, Typography } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { PublishedTopics, useReaderPlaygroundStore } from '../../-contexts/rfid-reader-playground.context'

const UnavailableConnection: React.FC = () => {
	const { publishMessage } = useReaderPlaygroundStore('publishMessage')

	const { t } = useTranslation()

	return (
		<Div className='flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center *:text-pretty'>
			<Icon
				name='ZapOff'
				size={48}
				stroke='hsl(var(--muted-foreground))'
				strokeWidth={1}
				className='mb-6 rotate-12 stroke-muted-foreground'
			/>
			<Typography className='font-medium'>{t('ns_rfid:rfid_agent_connection_failure.title')}</Typography>
			<Typography variant='small' color='muted' className='mb-3'>
				{t('ns_rfid:rfid_agent_connection_failure.description')}
			</Typography>
			<Div className='inline-flex items-center gap-x-1'>
				<Button
					size='sm'
					onClick={() =>
						publishMessage(PublishedTopics.REQUEST_SIGNAL, {
							action: 'ping'
						})
					}>
					<Icon name='RotateCcw' />
					{t('ns_common:actions.retry')}
				</Button>
				<Button
					size='sm'
					variant='link'
					onClick={() =>
						toast.info('This feature is coming soon!', {
							description: 'We are working hard to provide you the best experience.'
						})
					}>
					{t('ns_common:actions.learn_more')} <Icon name='ArrowUpRight' />
				</Button>
				{/* <RFIDAgentInstructionDialog /> */}
			</Div>
		</Div>
	)
}

export default UnavailableConnection
