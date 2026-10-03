import { Div, Icon, Typography } from '@components/ui'
import { useTranslation } from 'react-i18next'

const PageHeader: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='relative mt-4 place-content-center place-items-center space-y-2 text-center'>
			<Icon className='inline-block' name='FileSearch' size={48} stroke='var(--muted-foreground)' strokeWidth={1} />
			<Typography className='bg-background z-10 font-medium' variant='h3'>
				{t('ns_inoutbound:titles.inoutbound_history_lookup')}
			</Typography>
			<Typography color='muted'>{t('ns_inoutbound:description.inoutbound_history_lookup')}</Typography>
		</Div>
	)
}

export default PageHeader
