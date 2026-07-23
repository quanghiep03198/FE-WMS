import { Div, Icon, Typography } from '@components/ui'
import { useTranslation } from 'react-i18next'

const PageHeader: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='flex flex-col items-center gap-y-2'>
			<Div className='mb-2'>
				<Icon name='PackageSearch' size={52} strokeWidth={1} />
			</Div>
			<Typography variant='h4' className='text-center capitalize'>
				{t('ns_inoutbound:titles.production_inventory_summary')}
			</Typography>
			<Typography color='muted'>{t('ns_inoutbound:description.inventory_estimation')}</Typography>
		</Div>
	)
}

export default PageHeader
