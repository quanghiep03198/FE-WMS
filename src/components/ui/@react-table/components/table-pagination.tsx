import useQueryParams from '@/common/hooks/use-query-params'
import { Row, Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import {
	Button,
	Div,
	Icon,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Tooltip,
	Typography,
	buttonVariants
} from '../..'
import { Link } from '@tanstack/react-router'
import { cn } from '@/common/utils/cn'

type DataTablePaginationProps<TData> = {
	table: Table<TData>
	manualPagination?: boolean
	enableRowSelection: boolean
} & Partial<Pagination<TData>>

export default function TablePagination<TData>({
	table,
	enableRowSelection,
	manualPagination = false,
	hasNextPage = false,
	hasPrevPage = false,
	page = 1,
	totalPages = 1,
	limit = 10,
	totalDocs = 0
}: DataTablePaginationProps<TData>) {
	const { t } = useTranslation('ns_common')
	const { setParams } = useQueryParams()

	const canNextPage = manualPagination ? hasNextPage : table.getCanNextPage()
	const canPreviousPage = manualPagination ? hasPrevPage : table.getCanPreviousPage()
	const pageCount = manualPagination ? totalPages : table.getPageCount()
	const pageSize = manualPagination ? limit : table.getState().pagination.pageSize
	const pageIndex = manualPagination ? page : table.getState().pagination.pageIndex + 1

	const pageIndexCtx = String(pageIndex) + '/' + String(pageCount)
	const selectedRowsCtx =
		String(table.getFilteredSelectedRowModel().rows.length) + '/' + String(table.getFilteredRowModel().rows.length)

	const gotoFirstPage = () => {
		table.setPageIndex(0)
		setParams({ page: 1 })
	}

	const gotoPreviousPage = () => {
		table.previousPage()
		setParams({ page: pageIndex - 1 })
	}

	const gotoNextPage = () => {
		console.log()
		table.nextPage()
		setParams({ page: pageIndex + 1 })
	}

	const gotoLastPage = () => {
		table.setPageIndex(pageCount - 1)
		setParams({ page: pageCount })
	}

	const changePageSize = (value: number) => {
		if (value! > totalDocs) {
			gotoFirstPage()
		}
		setParams({ limit: value })
		if (!manualPagination) table.setPageSize(value)
	}

	return (
		<Div className={cn('flex items-center', enableRowSelection ? 'justify-between sm:justify-end' : 'justify-end')}>
			<Div className={cn('flex-1 text-sm text-muted-foreground sm:hidden', !enableRowSelection && 'hidden')}>
				{t('ns_common:table.selected_rows', {
					selectedRows: selectedRowsCtx,
					defaultValue: selectedRowsCtx
				})}
			</Div>
			<Div className='flex items-center space-x-6 lg:space-x-8'>
				<Div className='flex items-center space-x-2'>
					<Typography variant='small' className='font-medium'>
						{t('ns_common:table.display')}
					</Typography>
					<Select
						value={pageSize?.toString()}
						onValueChange={(value) => {
							changePageSize(+value)
						}}>
						<SelectTrigger className='w-20'>
							<SelectValue placeholder={pageSize} />
						</SelectTrigger>
						<SelectContent side='top'>
							{[10, 20, 50, 100].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Div>
				<Div className='flex w-[100px] items-center justify-center text-sm font-medium'>
					{t('table.page', {
						ns: 'ns_common',
						defaultValue: pageIndexCtx,
						page: pageIndexCtx
					})}
				</Div>
				<Div className='flex items-center space-x-1'>
					<Tooltip message={t('pagination.first_page', { defaultValue: 'First page' })}>
						<Link
							disabled={!canPreviousPage}
							search={{ page: 1 }}
							onClick={table.firstPage}
							className={buttonVariants({
								variant: 'outline',
								size: 'icon',
								className: cn(!canPreviousPage && '!pointer-events-none !bg-muted !text-muted-foreground')
							})}>
							<Icon name='ChevronsLeft' />
						</Link>
					</Tooltip>
					<Tooltip message={t('pagination.previous_page', { defaultValue: 'Previous page' })}>
						<Link
							disabled={!canPreviousPage}
							search={{ page: pageIndex - 1 }}
							onClick={table.previousPage}
							className={buttonVariants({
								variant: 'outline',
								size: 'icon',
								className: cn(!canPreviousPage && '!pointer-events-none !bg-muted !text-muted-foreground')
							})}>
							<Icon name='ChevronLeft' />
						</Link>
					</Tooltip>
					<Tooltip message={t('pagination.next_page', { defaultValue: 'Next page' })}>
						<Link
							disabled={!canNextPage}
							search={{ page: pageIndex + 1 }}
							onClick={table.nextPage}
							className={buttonVariants({
								variant: 'outline',
								size: 'icon',
								className: cn(!canNextPage && '!pointer-events-none !bg-muted !text-muted-foreground')
							})}>
							<Icon name='ChevronRight' />
						</Link>
					</Tooltip>
					<Tooltip message={t('pagination.last_page', { defaultValue: 'Last page' })}>
						<Link
							disabled={!canNextPage}
							search={{ page: pageCount }}
							onClick={table.lastPage}
							className={buttonVariants({
								variant: 'outline',
								size: 'icon',
								className: cn(!canNextPage && '!pointer-events-none !bg-muted !text-muted-foreground')
							})}>
							<Icon name='ChevronsRight' />
						</Link>
					</Tooltip>
				</Div>
			</Div>
		</Div>
	)
}

TablePagination.displayName = 'TablePagination'
