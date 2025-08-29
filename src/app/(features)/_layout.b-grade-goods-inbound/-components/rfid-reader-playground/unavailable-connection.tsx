import { Button, Div, Icon, Typography } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { useReaderPlaygroundStore } from '../../-contexts/rfid-reader-playground.context'

const UnavailableConnection: React.FC = () => {
	const { publishMessage } = useReaderPlaygroundStore('publishMessage')

	const { t } = useTranslation()

	return (
		<Div className='flex h-full flex-col items-center justify-center gap-2 p-2 text-center *:text-pretty'>
			<Div className='mb-6 size-14 place-content-center place-items-center rounded-md bg-muted'>
				<Icon name='PowerOff' size={28} stroke='hsl(var(--muted-foreground))' />
			</Div>
			<Typography className='font-medium'>
				{t('ns_inoutbound:rfid_agent.not_connected', 'RFID agent is not successfully connected')}
			</Typography>
			<Typography variant='small' color='muted' className='mb-3'>
				{t(
					'ns_inoutbound:rfid_agent.not_connected_description',
					'Please ensure that the RFID agent is running and properly configured.'
				)}
			</Typography>
			<Div className='inline-flex items-center gap-x-1'>
				<Button
					size='sm'
					onClick={() =>
						publishMessage('request/signal', {
							act: 'ping'
						})
					}>
					<Icon name='RotateCcw' />
					{t('ns_common:actions.retry')}
				</Button>
				<Button size='sm' variant='link'>
					Learn more <Icon name='ArrowUpRight' />
				</Button>
			</Div>
		</Div>
	)
}

export default UnavailableConnection
