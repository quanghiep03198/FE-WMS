import { useTranslation } from 'react-i18next'
import { Tooltip } from '../../../customs/tooltip'
import { Icon } from '../../../ui/icon'
import { Toggle } from '../../../ui/toggle'
import { useTableContext } from '../context/table.context'

const ColumnFilterToggle: React.FC = () => {
	const { t } = useTranslation()
	const { filterOpen, setFilterOpen } = useTableContext('filterOpen', 'setFilterOpen')

	return (
		<Tooltip message={t('ns_common:table.filter')} triggerProps={{ asChild: true }}>
			<Toggle
				className='aria-pressed:bg-accent aria-pressed:text-accent-foreground hover:text-foreground size-9 place-content-center p-0'
				pressed={filterOpen}
				variant='outline'
				onPressedChange={(pressed) => {
					setFilterOpen(pressed)
				}}>
				<Icon name='Funnel' />
			</Toggle>
		</Tooltip>
	)
}

export default ColumnFilterToggle
