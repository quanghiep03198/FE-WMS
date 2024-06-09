import useQueryParams from '@/common/hooks/use-query-params'
import { Table } from '@tanstack/react-table'
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
	Typography
} from '../..'

type DataTablePaginationProps<TData> = {
	table: Table<TData>
	manualPagination?: boolean
} & Partial<Pagination<TData>>

export default function TablePagination<TData>({
	table,
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
		<Div className='flex items-center justify-between sm:justify-end'>
			<Div className='flex-1 text-sm text-muted-foreground sm:hidden'>
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
						<SelectTrigger className='h-8 w-[70px]'>
							<SelectValue placeholder={pageSize} />
						</SelectTrigger>
						<SelectContent side='top'>
							{[10, 20, 30, 40, 50].map((pageSize) => (
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
					<Tooltip content={t('pagination.first_page', { defaultValue: 'First page' })}>
						<Button
							variant='outline'
							size='icon'
							className='h-8 w-8'
							onClick={gotoFirstPage}
							disabled={!canPreviousPage}>
							<Icon name='ChevronsLeft' />
						</Button>
					</Tooltip>
					<Tooltip content={t('pagination.previous_page', { defaultValue: 'Previous page' })}>
						<Button
							variant='outline'
							size='icon'
							className='h-8 w-8'
							onClick={gotoPreviousPage}
							disabled={!canPreviousPage}>
							<Icon name='ChevronLeft' />
						</Button>
					</Tooltip>
					<Tooltip content={t('pagination.next_page', { defaultValue: 'Next page' })}>
						<Button
							variant='outline'
							size='icon'
							className='h-8 w-8'
							onClick={gotoNextPage}
							disabled={!canNextPage}>
							<Icon name='ChevronRight' />
						</Button>
					</Tooltip>
					<Tooltip content={t('pagination.last_page', { defaultValue: 'Last page' })}>
						<Button
							variant='outline'
							size='icon'
							className='h-8 w-8'
							onClick={gotoLastPage}
							disabled={!canNextPage}>
							<Icon name='ChevronsRight' />
						</Button>
					</Tooltip>
				</Div>
			</Div>
		</Div>
	)
}

TablePagination.displayName = 'TablePagination'
