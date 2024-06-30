import useQueryParams from '@/common/hooks/use-query-params'
import { cn } from '@/common/utils/cn'
import { Link } from '@tanstack/react-router'
import { Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { PaginationProps } from '..'
import {
	Div,
	Icon,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
	Tooltip,
	buttonVariants
} from '../..'

type DataTablePaginationProps<TData> = {
	table: Table<TData>
	manualPagination?: boolean
} & PaginationProps<TData>

export default function TablePagination<TData>({
	table,
	manualPagination,
	hasNextPage = false,
	hasPrevPage = false,
	page = 1,
	totalPages = 1,
	limit = 10,
	totalDocs = 0,
	prefetch
}: DataTablePaginationProps<TData>) {
	const { t } = useTranslation('ns_common')
	const { setParams } = useQueryParams()

	const canNextPage = manualPagination ? hasNextPage : table.getCanNextPage()
	const canPreviousPage = manualPagination ? hasPrevPage : table.getCanPreviousPage()
	const pageCount = manualPagination ? totalPages : table.getPageCount()
	const pageSize = manualPagination ? limit : table.getState().pagination.pageSize
	const pageIndex = manualPagination ? page : table.getState().pagination.pageIndex + 1
	const pageIndexContext = String(pageIndex) + '/' + String(pageCount)
	const { searchParams } = useQueryParams()

	const changePageSize = (value: number) => {
		if (value! > totalDocs) {
			table.setPageIndex(0)
			setParams({ page: 1 })
		}
		setParams({ limit: value })
		if (!manualPagination) table.setPageSize(value)
	}

	const handlePrefetch = (params: Record<string, any>) => {
		if (!manualPagination || typeof prefetch !== 'function') return
		prefetch(params)
	}

	return (
		<Div className='ml-auto flex items-center space-x-6 lg:space-x-8'>
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
						{[10, 20, 50, 100].map((pageSize) => (
							<SelectItem
								key={pageSize}
								value={`${pageSize}`}
								onMouseEnter={() => handlePrefetch({ ...searchParams, limit: pageSize })}>
								{pageSize}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Div>
			<Separator orientation='vertical' className='h-6 w-1 bg-border' />
			<Div className='flex w-20 items-center justify-center text-sm font-medium'>
				{t('table.page', {
					ns: 'ns_common',
					defaultValue: pageIndexContext,
					page: pageIndexContext
				})}
			</Div>
			<Separator orientation='vertical' className='h-6 w-1 bg-border' />
			<Div className='flex items-center space-x-1'>
				<Tooltip message={t('pagination.first_page', { defaultValue: 'First page' })}>
					<Link
						role='button'
						aria-disabled={!canPreviousPage}
						aria-label='First page'
						disabled={!canPreviousPage}
						search={{ ...searchParams, limit: pageSize, page: 1 }}
						onClick={table.firstPage}
						onMouseEnter={() => handlePrefetch({ ...searchParams, page: 1 })}
						className={cn(
							buttonVariants({
								variant: 'outline',
								size: 'icon'
							}),
							!canPreviousPage && 'pointer-events-none bg-muted text-muted-foreground'
						)}>
						<Icon name='ChevronsLeft' />
					</Link>
				</Tooltip>
				<Tooltip message={t('pagination.previous_page', { defaultValue: 'Previous page' })}>
					<Link
						role='button'
						aria-disabled={!canPreviousPage}
						aria-label='Previous page'
						disabled={!canPreviousPage}
						search={{ ...searchParams, limit: pageSize, page: pageIndex - 1 }}
						onClick={table.previousPage}
						onMouseEnter={() => handlePrefetch({ ...searchParams, page: pageIndex - 1 })}
						className={cn(
							buttonVariants({
								variant: 'outline',
								size: 'icon'
							}),
							!canPreviousPage && 'pointer-events-none bg-muted text-muted-foreground'
						)}>
						<Icon name='ChevronLeft' />
					</Link>
				</Tooltip>
				<Tooltip message={t('pagination.next_page', { defaultValue: 'Next page' })}>
					<Link
						role='button'
						aria-disabled={!canNextPage}
						aria-label='Next page'
						disabled={!canNextPage}
						search={{ ...searchParams, page: pageIndex + 1 }}
						onClick={table.nextPage}
						onMouseEnter={() => handlePrefetch({ ...searchParams, page: pageIndex + 1 })}
						className={cn(
							buttonVariants({
								variant: 'outline',
								size: 'icon'
							}),
							!canNextPage && 'pointer-events-none bg-muted text-muted-foreground'
						)}>
						<Icon name='ChevronRight' />
					</Link>
				</Tooltip>
				<Tooltip message={t('pagination.last_page', { defaultValue: 'Last page' })}>
					<Link
						role='button'
						aria-disabled={!canNextPage}
						aria-label='Last page'
						disabled={!canNextPage}
						search={{ ...searchParams, page: pageCount }}
						onClick={table.lastPage}
						onMouseEnter={() => handlePrefetch({ ...searchParams, page: pageCount })}
						className={cn(
							buttonVariants({
								variant: 'outline',
								size: 'icon'
							}),
							!canNextPage && 'pointer-events-none bg-muted text-muted-foreground'
						)}>
						<Icon name='ChevronsRight' />
					</Link>
				</Tooltip>
			</Div>
		</Div>
	)
}

TablePagination.displayName = 'TablePagination'
