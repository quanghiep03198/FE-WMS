import React from 'react'

import { type TableFooterProps } from '../types'
import { Div } from '@/components/ui'
import { Table } from '@tanstack/react-table'
import { cn } from '@/common/utils/cn'

export function TableFooter<TData>({
	table,
	hidden,
	slot: Slot,
	rtl: rtl
}: TableFooterProps & { table: Table<TData> & React.PropsWithChildren }) {
	if (hidden || !Slot) return null

	return (
		<Div className={cn('flex items-center gap-x-1 bg-background px-4 py-2', rtl ? 'justify-start' : 'justify-end')}>
			<Slot table={table} />
		</Div>
	)
}
