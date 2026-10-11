import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { Icon } from '@components/ui/icon'
import { useTranslation } from 'react-i18next'

const PageHeader: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='flex flex-col items-center gap-y-2'>
			<Div className='mb-2'>
				<Icon name='PackageSearch' size={52} strokeWidth={1} />
			</Div>
			<Typography className='text-center capitalize' variant='h4'>
				{t('ns_inoutbound:titles.production_inventory_summary')}
			</Typography>
			<Typography color='muted'>{t('ns_inoutbound:description.inventory_estimation')}</Typography>
		</Div>
	)
}

export default PageHeader
