import { cn } from '@/common/utils/cn'
import { PaginationState, RowData, Table } from '@tanstack/react-table'
import React, { memo, useEffect, useRef } from 'react'
import isEqual from 'react-fast-compare'
import { useTranslation } from 'react-i18next'
import { Button, ButtonGroup, Div, Icon, Label, Separator, Tooltip, Typography } from '../..'
import AutoComplete from '../../@custom/auto-complete'
import { type PaginationBaseProps } from '../types'

export type DataTablePaginationProps<TData extends RowData> = {
	table: Table<TData>
	manualPagination?: boolean
	controlledPaginationProps: Partial<Omit<Pagination<TData>, 'data'>>
	onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>
	[key: string]: any
} & PaginationBaseProps<TData>

function TablePagination<TData>({
	table,
	loading,
	manualPagination,
	controlledPaginationProps,
	onPaginationChange,
	prefetch
}: DataTablePaginationProps<TData>) {
	'use no memo'

	const { t } = useTranslation('ns_common')
	const { firstPage, lastPage, nextPage, previousPage, setPageSize } = table
	const timeoutRef = useRef<NodeJS.Timeout>(null)
	const prefetchCountRef = useRef<number>(0)

	const canNextPage = manualPagination ? controlledPaginationProps?.hasNextPage : table.getCanNextPage()
	const canPreviousPage = manualPagination ? controlledPaginationProps?.hasPrevPage : table.getCanPreviousPage()
	const pageCount = manualPagination ? controlledPaginationProps?.totalPages : table.getPageCount()
	const pageSize = manualPagination ? controlledPaginationProps?.limit : table.getState().pagination.pageSize
	const pageIndex = manualPagination ? controlledPaginationProps?.page : table.getState().pagination.pageIndex + 1
	const rowCount = manualPagination ? controlledPaginationProps.totalDocs : table.getRowCount()

	const pageIndexContext = String(pageIndex) + '/' + String(pageCount)

	const changePageSize = (value: string) => {
		if (isNaN(+value)) return

		if (+value > rowCount) {
			goToFirstPage()
		}
		setPageSize(+value)
	}

	const handlePrefetch = (params: Record<string, unknown>) => {
		if (!manualPagination || typeof prefetch !== 'function') return
		prefetch(params)
	}

	const handlePrefetchNextPage = () => {
		if (!manualPagination || typeof prefetch !== 'function') return

		timeoutRef.current = setInterval(() => {
			prefetchCountRef.current++
			// Prefetch next 20 pages and will be cancelled on last page
			const canPrefetch = pageIndex + prefetchCountRef.current <= pageCount && prefetchCountRef.current <= 20
			if (!canPrefetch) {
				clearInterval(timeoutRef.current)
				return
			}
			prefetch({ page: pageIndex + prefetchCountRef.current, limit: pageSize })
		}, 100)
	}

	const goToFirstPage = () => {
		if (manualPagination && typeof onPaginationChange === 'function') {
			onPaginationChange({ pageIndex: 0, pageSize })
		} else {
			firstPage()
		}
	}

	const goToLastPage = () => {
		if (manualPagination && typeof onPaginationChange === 'function') {
			onPaginationChange({ pageIndex: pageCount - 1, pageSize })
		} else {
			lastPage()
		}
	}

	useEffect(() => {
		if (pageIndex > pageCount) goToFirstPage()
	}, [pageCount])

	return (
		<Div
			role='navigation'
			className='ml-auto flex items-center space-x-2 py-0.5 sm:space-x-2 lg:space-x-4 xl:space-x-4'>
			<Div className='flex items-center space-x-2'>
				<Label className='whitespace-nowrap font-medium'>{t('ns_common:table.rows_per_page')}</Label>
				<AutoComplete
					type='number'
					value={pageSize === 1 ? null : pageSize}
					defaultValue={10}
					min={10}
					onInput={(value) => changePageSize(value)}
					onSelect={(value) => changePageSize(value)}
					placeholder={'0'}
					shouldFilter={false}
					className='w-24'
					datalist={[10, 20, 30, 40, 50].map((size) => ({ label: String(size), value: size }))}
					labelField='label'
					valueField='value'
				/>
				{/* <Select
					value={customPageSize?.toString() || pageSize?.toString()}
					onValueChange={(value) => {
						if (value === 'custom') {
							setCustomPageSize('custom')
							return
						}
						changePageSize(+value)
					}}>
					<SelectTrigger className='w-20'>
						{pageSize?.toString() === 'custom' ? (
							<Input type='number' min={10} className='h-8 border-none shadow-none outline-none' />
						) : (
							<SelectValue placeholder={pageSize} />
						)}
					</SelectTrigger>
					<SelectContent>
						{[10, 20, 30, 40, 50].map((pageSize) => (
							<SelectItem
								key={pageSize}
								value={String(pageSize)}
								onMouseEnter={() => handlePrefetch({ page: pageIndex, limit: +pageSize })}>
								{pageSize}
							</SelectItem>
						))}
						<SelectItem value='custom'>{t('ns_common:others.other')}</SelectItem>
					</SelectContent>
				</Select> */}
			</Div>
			<Separator orientation='vertical' className='h-6 w-1 bg-border sm:hidden md:hidden' />
			<Typography variant='small' className='whitespace-nowrap text-center font-medium'>
				{t('table.page', {
					ns: 'ns_common',
					defaultValue: pageIndexContext,
					page: pageIndexContext
				})}
			</Typography>
			<Separator orientation='vertical' className='h-6 w-1 bg-border sm:hidden md:hidden' />
			<ButtonGroup>
				<Tooltip
					message={t('pagination.first_page', { defaultValue: 'First page' })}
					triggerProps={{ asChild: true }}>
					<Button
						role='button'
						aria-disabled={!canPreviousPage || loading}
						aria-label='First page'
						disabled={!canPreviousPage || loading}
						variant='outline'
						size='icon'
						onClick={goToFirstPage}
						onMouseEnter={() => handlePrefetch({ limit: pageSize, page: 1 })}
						className={cn(!canPreviousPage && 'pointer-events-none bg-muted text-muted-foreground')}>
						<Icon name='ChevronsLeft' />
					</Button>
				</Tooltip>
				<Tooltip
					message={t('pagination.previous_page', { defaultValue: 'Previous page' })}
					triggerProps={{ asChild: true }}>
					<Button
						role='button'
						aria-disabled={!canPreviousPage || loading}
						aria-label='Previous page'
						disabled={!canPreviousPage || loading}
						variant='outline'
						size='icon'
						onClick={previousPage}
						onMouseEnter={() => handlePrefetch({ limit: pageSize, page: pageIndex - 1 })}
						className={cn(!canPreviousPage && 'pointer-events-none bg-muted text-muted-foreground')}>
						<Icon name='ChevronLeft' />
					</Button>
				</Tooltip>
				<Tooltip
					message={t('pagination.next_page', { defaultValue: 'Next page' })}
					triggerProps={{ asChild: true }}>
					<Button
						role='button'
						aria-disabled={!canNextPage || loading}
						aria-label='Next page'
						disabled={!canNextPage || loading}
						variant='outline'
						size='icon'
						onClick={nextPage}
						onMouseEnter={handlePrefetchNextPage}
						onMouseLeave={() => {
							clearInterval(timeoutRef.current)
							prefetchCountRef.current = 0
						}}
						className={cn(!canNextPage && 'pointer-events-none bg-muted text-muted-foreground')}>
						<Icon name='ChevronRight' />
					</Button>
				</Tooltip>
				<Tooltip
					message={t('pagination.last_page', { defaultValue: 'Last page' })}
					triggerProps={{ asChild: true }}
					contentProps={{ align: 'end' }}>
					<Button
						role='button'
						aria-disabled={!canNextPage || loading}
						aria-label='Last page'
						disabled={!canNextPage || loading}
						variant='outline'
						size='icon'
						onClick={goToLastPage}
						onMouseEnter={() => handlePrefetch({ limit: pageSize, page: pageCount })}
						className={cn(!canNextPage && 'pointer-events-none bg-muted text-muted-foreground')}>
						<Icon name='ChevronsRight' />
					</Button>
				</Tooltip>
			</ButtonGroup>
		</Div>
	)
}

TablePagination.displayName = 'TablePagination'

export default memo(
	TablePagination,
	(prevProps, nextProps) =>
		isEqual(prevProps.controlledPaginationProps, nextProps.controlledPaginationProps) &&
		nextProps.table.getState().columnSizingInfo.isResizingColumn !== false
) as typeof TablePagination
