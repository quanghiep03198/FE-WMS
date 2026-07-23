import { Div, Icon, Typography } from '@components/ui'
import { useTranslation } from 'react-i18next'

const OrderDetailTableEmptyState: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='text-muted-foreground absolute inset-0 grid place-content-center text-center text-sm'>
			<Typography className='inline-flex items-center gap-x-2'>
				<Icon name='Inbox' size={32} strokeWidth={1} />
				{t('ns_common:table.no_data')}
			</Typography>
		</Div>
	)
}

export default OrderDetailTableEmptyState
