import { Div, Icon, Typography } from '@/components/ui'
import { useTranslation } from 'react-i18next'

export const PlaygroundEmptyDataState: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='z-10 grid h-full flex-1 place-content-center'>
			<Div className='inline-flex items-center gap-x-4'>
				<Icon name='Inbox' stroke='hsl(var(--muted-foreground))' size={32} strokeWidth={1} />
				<Typography color='muted'> {t('ns_common:table.no_data')}</Typography>
			</Div>
		</Div>
	)
}
