'use no memo'

import useEventEmitter from '@/common/hooks/use-event-emitter'
import { cn } from '@/common/utils/cn'
import { Header } from '@tanstack/react-table'
import { Collapsible, CollapsibleContent } from '../../@core/collapsible'
import { TableHead } from '../../@core/table'
import { useTableContext } from '../context/table.context'
import { DataTableUtility } from '../utils/table.util'
import { ColumnFilter } from './column-filter'

type CollapsibleFilterCellProps<TData, TValue = unknown> = {
	header: Header<TData, TValue>
}

function CollapsibleFilterCell<TData, TValue>({ header }: CollapsibleFilterCellProps<TData, TValue>) {
	const { instanceId } = useTableContext()
	const [isFilterOpened] = useEventEmitter<boolean>(`toggle-filter-${instanceId}`)

	return (
		<TableHead
			key={header.id}
			colSpan={header.colSpan}
			className={cn('group relative z-40 p-0', isFilterOpened ? 'border-b border-border' : 'border-none')}
			style={{
				width: `calc(var(--header-${header?.id}-size) * 1px)`,
				...DataTableUtility.getStickyOffsetPosition(header?.column)
			}}>
			<Collapsible data-state={open ? 'open' : 'closed'} open={isFilterOpened}>
				<CollapsibleContent className='h-10 overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
					<ColumnFilter column={header.column} />
				</CollapsibleContent>
			</Collapsible>
		</TableHead>
	)
}

export default CollapsibleFilterCell
