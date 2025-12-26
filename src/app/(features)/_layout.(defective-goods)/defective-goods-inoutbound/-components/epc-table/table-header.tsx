import { TableHead, TableHeader, TableRow } from '@/components/ui'
import { IDefectiveGoods } from '@/services/defective-goods.service'
import { flexRender, Table } from '@tanstack/react-table'
import { Fragment, memo } from 'react'
import { TableColumnFilter } from './table-column-filter'

export const DataTableHeader: React.FC<{ table: Table<IDefectiveGoods> }> = ({ table }) => {
	'use no memo'

	return (
		<TableHeader className='sticky top-0 z-50 bg-background [&_tr]:h-[var(--row-height)]'>
			{table.getHeaderGroups().map((headerGroup) => (
				<Fragment key={headerGroup.id}>
					<TableRow>
						{headerGroup.headers.map((header) => {
							const { columnDef } = header.column
							return (
								<TableHead
									key={header.id}
									colSpan={header.colSpan}
									className='border-b border-b-border bg-accent/80 text-accent-foreground'
									style={{ width: header.getSize() }}
									align={columnDef.meta?.align}>
									{header.isPlaceholder ? null : (
										<span className='line-clamp-1 text-left text-sm text-inherit'>
											{flexRender(columnDef.header, header.getContext())}
										</span>
									)}
								</TableHead>
							)
						})}
					</TableRow>
					<TableRow>
						{headerGroup.headers.map((header) => {
							const { columnDef } = header.column
							return (
								<TableHead
									key={header.id}
									className='border-b border-b-border bg-table-head text-table-head-foreground'
									style={{ width: header.getSize(), padding: 0 }}
									align={columnDef.meta?.align}>
									<TableColumnFilter column={header.column} />
								</TableHead>
							)
						})}
					</TableRow>
				</Fragment>
			))}
		</TableHeader>
	)
}

export const MemoizedDataTableHeader = memo(DataTableHeader)
