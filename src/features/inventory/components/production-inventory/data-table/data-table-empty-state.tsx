import { Div, Icon, TableCell, TableRow } from '@components/ui'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

const EmptyState: React.FC<{ colSpan: number }> = ({ colSpan }) => {
	const { t } = useTranslation()

	return (
		<TableRow>
			<TableCell colSpan={colSpan}>
				<Div className='text-muted-foreground flex h-40 items-center justify-center gap-x-4 text-sm'>
					<Icon name='Database' size={28} strokeWidth={1.5} />
					{t('ns_common:table.no_data')}
				</Div>
			</TableCell>
		</TableRow>
	)
}

EmptyState.displayName = 'EmptyState'

export default memo(EmptyState)
