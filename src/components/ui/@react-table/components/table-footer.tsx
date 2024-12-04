import React from 'react'

import { cn } from '@/common/utils/cn'
import { Div, Separator } from '@/components/ui'
import { Table } from '@tanstack/react-table'
import { type TableFooterProps } from '../types'

function TableFooter({
	table,
	hidden,
	slot: Slot,
	rtl: rtl
}: TableFooterProps & { table: Table<any> & React.PropsWithChildren }) {
	if (hidden || !Slot) return null

	return (
		<>
			<Separator />
			<Div
				className={cn('flex items-center gap-x-1 bg-background px-4 py-2', rtl ? 'justify-start' : 'justify-end')}>
				<Slot table={table} />
			</Div>
		</>
	)
}

export default TableFooter
