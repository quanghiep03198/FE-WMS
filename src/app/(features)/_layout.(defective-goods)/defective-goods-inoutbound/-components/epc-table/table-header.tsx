import { cn } from '@/common/utils/cn'
import { Separator, TableHead, TableHeader, TableRow } from '@/components/ui'
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
									className='group relative z-20 border-b border-b-border bg-accent/80 text-accent-foreground'
									style={{ width: `var(--header-${header?.id}-size)` }}
									align={columnDef.meta?.align}>
									{header.isPlaceholder ? null : (
										<span className='line-clamp-1 text-left text-sm text-inherit'>
											{flexRender(columnDef.header, header.getContext())}
										</span>
									)}
									<Separator
										onDoubleClick={() => header.column.resetSize()}
										onMouseDown={header.getResizeHandler()}
										onTouchStart={header.getResizeHandler()}
										onTouchMove={header.getResizeHandler()}
										className={cn(
											'absolute inset-y-0 right-0 z-50 h-[var(--row-height)] w-1 cursor-col-resize touch-none select-none bg-border opacity-0 transition-opacity duration-500 group-hover:opacity-100',
											header.column.getCanResize() && 'hover:bg-primary',
											header.column.getIsResizing() && 'bg-primary opacity-10'
										)}
									/>
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
