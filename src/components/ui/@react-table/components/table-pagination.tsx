import { cn } from '@/common/utils/cn'
import { PaginationState, Table } from '@tanstack/react-table'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Button,
	Div,
	Icon,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
	Tooltip
} from '../..'
import { type PaginationBaseProps } from '../types'

type DataTablePaginationProps<TData> = {
	table: Table<TData>
	manualPagination?: boolean
	loading: boolean
	onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>
} & PaginationBaseProps<TData>

function TablePagination<TData>({
	table,
	loading,
	manualPagination,
	hasNextPage = false,
	hasPrevPage = false,
	page = 1,
	totalPages = 1,
	limit = 10,
	totalDocs = 0,
	onPaginationChange,
	prefetch
}: DataTablePaginationProps<TData>) {
	const { t } = useTranslation('ns_common')
	const timeoutRef = useRef<NodeJS.Timeout>()
	const prefetchCountRef = useRef<number>(0)

	const canNextPage = manualPagination ? hasNextPage : table.getCanNextPage()
	const canPreviousPage = manualPagination ? hasPrevPage : table.getCanPreviousPage()
	const pageCount = manualPagination ? totalPages : table.getPageCount()
	const pageSize = manualPagination ? limit : table.getState().pagination.pageSize
	const pageIndex = manualPagination ? page : table.getState().pagination.pageIndex + 1
	const pageIndexContext = String(pageIndex) + '/' + String(pageCount)

	const changePageSize = (value: number) => {
		if (value > totalDocs) {
			goToFirstPage()
		}
		table.setPageSize(value)
	}

	const handlePrefetch = (params: Record<string, any>) => {
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
		manualPagination && typeof onPaginationChange === 'function'
			? onPaginationChange({ pageIndex: 0, pageSize })
			: table.firstPage()
	}

	const goToLastPage = () => {
		manualPagination && typeof onPaginationChange === 'function'
			? onPaginationChange({ pageIndex: pageCount - 1, pageSize })
			: table.lastPage()
	}

	return (
		<Div role='navigation' className='ml-auto flex items-center space-x-6 py-1 lg:space-x-8'>
			<Div className='flex items-center space-x-2'>
				<Label className='font-medium'>{t('ns_common:table.rows_per_page')}</Label>
				<Select
					value={pageSize?.toString()}
					onValueChange={(value) => {
						changePageSize(+value)
					}}>
					<SelectTrigger className='w-20'>
						<SelectValue placeholder={pageSize} />
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
					</SelectContent>
				</Select>
			</Div>
			<Separator orientation='vertical' className='h-6 w-1 bg-border' />
			<Div className='flex w-20 items-center justify-center whitespace-nowrap text-sm font-medium'>
				{t('table.page', {
					ns: 'ns_common',
					defaultValue: pageIndexContext,
					page: pageIndexContext
				})}
			</Div>
			<Separator orientation='vertical' className='h-6 w-1 bg-border' />
			<Div className='flex items-center space-x-1'>
				<Tooltip message={t('pagination.first_page', { defaultValue: 'First page' })}>
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
				<Tooltip message={t('pagination.previous_page', { defaultValue: 'Previous page' })}>
					<Button
						role='button'
						aria-disabled={!canPreviousPage || loading}
						aria-label='Previous page'
						disabled={!canPreviousPage || loading}
						variant='outline'
						size='icon'
						onClick={table.previousPage}
						onMouseEnter={() => handlePrefetch({ limit: pageSize, page: pageIndex - 1 })}
						className={cn(!canPreviousPage && 'pointer-events-none bg-muted text-muted-foreground')}>
						<Icon name='ChevronLeft' />
					</Button>
				</Tooltip>
				<Tooltip message={t('pagination.next_page', { defaultValue: 'Next page' })}>
					<Button
						role='button'
						aria-disabled={!canNextPage || loading}
						aria-label='Next page'
						disabled={!canNextPage || loading}
						variant='outline'
						size='icon'
						onClick={table.nextPage}
						onMouseEnter={handlePrefetchNextPage}
						onMouseLeave={() => {
							clearInterval(timeoutRef.current)
							prefetchCountRef.current = 0
						}}
						className={cn(!canNextPage && 'pointer-events-none bg-muted text-muted-foreground')}>
						<Icon name='ChevronRight' />
					</Button>
				</Tooltip>
				<Tooltip message={t('pagination.last_page', { defaultValue: 'Last page' })}>
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
			</Div>
		</Div>
	)
}

TablePagination.displayName = 'TablePagination'

export default TablePagination
