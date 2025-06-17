import { cn } from '@/common/utils/cn'
import { Div, Icon, Typography } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../-contexts/page-context'

const ConnectionInsight: React.FC = () => {
	const { t } = useTranslation()
	const { scanningState } = usePageContext('scanningState')

	return (
		<Div className='flex items-center gap-x-2'>
			<Icon
				name='Dot'
				className={cn(
					'scale-50 rounded-full ring-8',
					scanningState === 'success'
						? 'bg-success fill-success stroke-success ring-success/30'
						: 'bg-warning fill-warning stroke-warning ring-warning/30'
				)}
			/>
			<Typography variant='small' className='align-middle font-medium leading-none'>
				{scanningState === 'success' ? t('ns_common:status.running') : t('ns_common:status.idle')}
			</Typography>
		</Div>
	)
}

export default ConnectionInsight
