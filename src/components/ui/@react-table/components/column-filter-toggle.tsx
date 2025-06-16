import useEventEmitter from '@/common/hooks/use-event-emitter'
import { useTranslation } from 'react-i18next'
import { Button } from '../../@core/button'
import { Icon } from '../../@core/icon'
import { Tooltip } from '../../@override/tooltip'
import { useTableContext } from '../context/table.context'

const ColumnFilterToggle: React.FC = () => {
	const { t } = useTranslation()
	const { instanceId, defaultFilterOpen } = useTableContext()
	const [openState, dispatchOpenFilter] = useEventEmitter<boolean>(`toggle-filter-${instanceId}`, defaultFilterOpen)

	return (
		<Tooltip message={t('ns_common:table.filter')} triggerProps={{ asChild: true }}>
			<Button
				variant={openState ? 'secondary' : 'outline'}
				size='icon'
				onClick={() => dispatchOpenFilter(!openState, false)}>
				<Icon name='Filter' />
			</Button>
		</Tooltip>
	)
}

export default ColumnFilterToggle
