import { cn } from '@/common/utils/cn'
import { Div, Separator } from '@/components/ui'
import { Fragment, memo } from 'react'
import { useTableContext } from '../context/table.context'
import { type TableFooterProps } from '../types'

function TableFooter({ hidden, slot: Slot, rtl }: TableFooterProps) {
	const { table } = useTableContext('table')
	if (hidden || !Slot) return null

	return (
		<Fragment>
			<Separator />
			<Div className={cn('flex items-center gap-x-1 bg-background', rtl ? 'justify-start' : 'justify-end')}>
				<Slot table={table} />
			</Div>
		</Fragment>
	)
}

export default memo(TableFooter)
