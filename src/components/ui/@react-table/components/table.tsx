import { cn } from '@/common/utils/cn'
import { useSize, useUpdateEffect } from 'ahooks'
import React, { useId, useMemo, useRef } from 'react'
import tw from 'tailwind-styled-components'
import { Table, TableCaption } from '../..'
import { ROW_ACTIONS_COLUMN_ID } from '../constants'
import { useTableContext } from '../context/table.context'
import { type DataTableProps } from '../types'
import DataTableBody from './table-body'
import DataTableBodyLoading from './table-body-loading'
import DataTableEmpty from './table-empty'
import TableFooter from './table-footer'
import { TableHeadCaption } from './table-head-caption'
import { DataTableHeader } from './table-header'

type TableProps<TData, TValue> = Omit<DataTableProps<TData, TValue>, 'data' | 'slot'> &
	Omit<React.AllHTMLAttributes<HTMLTableElement>, 'data'> &
	Pick<React.ComponentProps<'div'>, 'style'>

function DataTable<TData, TValue>(props: TableProps<TData, TValue>) {
	const { table } = useTableContext('table')
	const containerRef = useRef<HTMLDivElement>(null)
	const captionId = useId()

	const {
		containerProps = { className: cn('h-[350px] xxl:h-[500px]') },
		footerProps = { hidden: true, slot: null },
		caption,
		loading,
		virtualizerOptions = {
			estimateSize: 40,
			overscan: 5
		},
		renderSubComponent
	} = props

	const containerSize = useSize(containerRef)

	const computedColumnSizes = useMemo(() => {
		const headers = table.getFlatHeaders()
		const columnSizes: Record<string, string> = {}
		headers.forEach((header) => {
			columnSizes[`--header-${header.id}-size`] = header.getSize() + 'px'
			columnSizes[`--column-${header.column.id}-size`] = header.column.getSize() + 'px'
		})
		return columnSizes
	}, [table.getState().columnSizingInfo, table.getState().columnSizing])

	const tableStyles = useMemo(
		() =>
			({
				'--table-width': containerSize?.width - 10 + 'px',
				'--table-height': containerSize?.height + 'px',
				'--header-row-height': '40px',
				'--row-height': `${virtualizerOptions.estimateSize}px`
			}) as React.CSSProperties,
		[containerSize, virtualizerOptions.estimateSize] // Chỉ tạo lại khi width thực sự thay đổi
	)

	useUpdateEffect(() => {
		table.setColumnPinning((prev) => {
			if (prev.right.includes(ROW_ACTIONS_COLUMN_ID)) {
				prev.right = prev.right.filter((id) => id !== ROW_ACTIONS_COLUMN_ID).concat(ROW_ACTIONS_COLUMN_ID)
			}
			return prev
		})
	}, [table.getState().columnPinning])

	return (
		<Wrapper style={{ ...computedColumnSizes, ...tableStyles }}>
			{caption && <TableHeadCaption id={captionId} aria-description={caption} />}
			<ScrollArea
				ref={containerRef}
				style={{
					scrollbarGutter: 'stable',
					overflowAnchor: 'none',
					touchAction: 'pan-y',
					WebkitOverflowScrolling: 'touch'
				}}
				{...containerProps}>
				<Table data-role='data-grid' className='table-auto border-separate border-spacing-0 border-none'>
					{caption && (
						<TableCaption aria-labelledby={captionId} className='hidden'>
							{caption}
						</TableCaption>
					)}
					<DataTableHeader />
					{loading ? (
						<DataTableBodyLoading />
					) : table.getRowModel().rows.length === 0 ? (
						<DataTableEmpty />
					) : (
						<DataTableBody
							table={table}
							containerRef={containerRef}
							estimatedRowHeight={virtualizerOptions.estimateSize}
							renderSubComponent={renderSubComponent}
						/>
					)}
				</Table>
			</ScrollArea>
			{footerProps && <TableFooter {...footerProps} />}
		</Wrapper>
	)
}

const Wrapper = tw.div`flex flex-col items-stretch border outline-none ring-0 ring-offset-0 ring-offset-transparent overflow-clip rounded-md`
const ScrollArea = tw.div`relative flex flex-col items-stretch overflow-scroll contain-strict will-change-scroll scrollbar-track-scrollbar/20 outline-none border-none ring-0 ring-offset-0 ring-offset-transparent backface-hidden`

DataTable.displayName = 'DataTable'

export default DataTable
