import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { useTranslation } from 'react-i18next'

const PageHeader: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='relative mt-4 place-content-center place-items-center space-y-2 text-center'>
			<Typography className='bg-background z-10 font-medium' variant='h2'>
				{t('ns_inoutbound:titles.inoutbound_history_lookup')}
			</Typography>
			<Typography color='muted'>{t('ns_inoutbound:description.inoutbound_history_lookup')}</Typography>
		</Div>
	)
}

export default PageHeader
