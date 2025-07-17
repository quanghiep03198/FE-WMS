import { Div, Icon, Typography } from '@/components/ui'
import { useTranslation } from 'react-i18next'

const PageHeader: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='relative place-content-end place-items-center space-y-2 py-2 text-center'>
			<Icon name='FileSearch' size={48} strokeWidth={1} />
			<Typography variant='h3' className='z-10 bg-background font-medium'>
				{t('ns_inoutbound:titles.inoutbound_history_lookup')}
			</Typography>
			<Typography color='muted'>{t('ns_inoutbound:description.inoutbound_history_lookup')}</Typography>
		</Div>
	)
}

export default PageHeader
