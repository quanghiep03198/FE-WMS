import { Div, Icon, Typography } from '@/components/ui'
import { useTranslation } from 'react-i18next'

const PageHeader: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='relative mt-4 place-content-end place-items-center space-y-2 text-center'>
			<Icon name='FileSearch2' size={48} strokeWidth={1} stroke='hsl(var(--muted-foreground))' />
			<Typography variant='h3' className='z-10 bg-background font-medium'>
				{t('ns_erp:titles.purchase_order_seeking')}
			</Typography>
			<Typography color='muted'>{t('ns_erp:descriptions.purchase_order_seeking')}</Typography>
		</Div>
	)
}

export default PageHeader
