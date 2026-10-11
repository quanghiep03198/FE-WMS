import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { Icon } from '@components/ui/icon'
import { useTranslation } from 'react-i18next'

export const PlaygroundEmptyDataState: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='z-10 grid h-full place-content-center'>
			<Div className='inline-flex items-center gap-x-4'>
				<Icon name='Inbox' size={32} stroke='var(--muted-foreground)' strokeWidth={1} />
				<Typography color='muted'> {t('ns_common:table.no_data')}</Typography>
			</Div>
		</Div>
	)
}
