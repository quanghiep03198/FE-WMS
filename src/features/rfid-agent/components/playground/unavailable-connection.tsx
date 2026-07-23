import {
	PublishedTopics,
	useReaderPlaygroundStore
} from '@/features/rfid-agent/contexts/rfid-reader-playground-context'
import { cn } from '@common/utils/cn'
import { Button, buttonVariants, Div, Icon, Typography } from '@components/ui'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const UnavailableConnection: React.FC = () => {
	const { publishMessage } = useReaderPlaygroundStore('publishMessage')

	const { t } = useTranslation()

	return (
		<Div className='flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center *:text-pretty'>
			<Icon
				name='ZapOff'
				size={44}
				stroke='var(--muted-foreground)'
				strokeWidth={1}
				className='stroke-muted-foreground mb-6 rotate-12'
			/>
			<Typography className='font-medium'>{t('ns_rfid:rfid_agent_connection_failure.title')}</Typography>
			<Typography variant='small' color='muted' className='mb-3'>
				{t('ns_rfid:rfid_agent_connection_failure.description')}
			</Typography>
			<Div className='inline-flex items-center gap-x-1'>
				<Button size='sm' onClick={() => publishMessage(PublishedTopics.REQUEST_SIGNAL, { action: 'ping' })}>
					<Icon name='RefreshCcw' />
					{t('ns_common:actions.retry')}
				</Button>
				<Link to='/rfid-agent' className={cn(buttonVariants({ variant: 'link', size: 'sm' }))}>
					{t('ns_common:actions.learn_more')} <Icon name='ArrowUpRight' />
				</Link>
			</Div>
		</Div>
	)
}

export default UnavailableConnection
