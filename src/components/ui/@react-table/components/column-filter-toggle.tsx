import { useTranslation } from 'react-i18next'
import { Icon } from '../../@core/icon'
import { Toggle } from '../../@core/toggle'
import { Tooltip } from '../../@override/tooltip'
import { useTableContext } from '../context/table.context'

const ColumnFilterToggle: React.FC = () => {
	const { t } = useTranslation()
	const { filterOpen, setFilterOpen } = useTableContext('filterOpen', 'setFilterOpen')

	return (
		<Tooltip message={t('ns_common:table.filter')} triggerProps={{ asChild: true }}>
			<Toggle
				variant='outline'
				className='size-9 place-content-center p-0 aria-pressed:bg-accent aria-pressed:text-accent-foreground hover:text-foreground'
				pressed={filterOpen}
				onPressedChange={(pressed) => {
					setFilterOpen(pressed)
				}}>
				<Icon name='Filter' />
			</Toggle>
		</Tooltip>
	)
}

export default ColumnFilterToggle
