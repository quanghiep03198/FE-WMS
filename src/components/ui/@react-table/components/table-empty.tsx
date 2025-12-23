import { Div, Icon, TableBody, TableCell, TableRow } from '@/components/ui'
import React from 'react'
import { useTableContext } from '../context/table.context'

const DataTableEmpty: React.FC = () => {
	const { table, filterOpen } = useTableContext('table', 'filterOpen')

	return (
		<TableBody
			className={
				filterOpen
					? 'h-[calc(var(--table-height)-2*var(--header-row-height)-2px)]'
					: 'h-[calc(var(--table-height)-var(--header-row-height)-1px)]'
			}>
			<TableRow>
				<TableCell colSpan={table.getAllColumns().length} className='p-0'>
					<Div className='sticky left-0 top-0 flex w-[var(--table-width)] items-center justify-center gap-x-2 text-muted-foreground'>
						<Icon name='Database' strokeWidth={1} size={32} /> No data
					</Div>
				</TableCell>
			</TableRow>
		</TableBody>
	)
}

export default DataTableEmpty
