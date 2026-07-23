import { Div, Icon, Typography } from '@components/ui'
import { useTranslation } from 'react-i18next'

const PageHeader: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='relative mt-4 place-content-center place-items-center space-y-2 text-center'>
			<Icon name='FileSearch' size={48} strokeWidth={1} stroke='var(--muted-foreground)' className='inline-block' />
			<Typography variant='h3' className='bg-background z-10 font-medium'>
				{t('ns_inoutbound:titles.inoutbound_history_lookup')}
			</Typography>
			<Typography color='muted'>{t('ns_inoutbound:description.inoutbound_history_lookup')}</Typography>
		</Div>
	)
}

export default PageHeader
