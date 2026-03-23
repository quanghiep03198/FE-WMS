import { PaginationState, Table } from '@tanstack/react-table'
import { AxiosRequestConfig } from 'axios'
import React, { memo, useEffect, useRef } from 'react'
import isEqual from 'react-fast-compare'
import { useTranslation } from 'react-i18next'
import { Button, ButtonGroup, Div, Icon, Label, Separator, Tooltip, Typography } from '../..'
import AutoComplete from '../../@custom/auto-complete'
import { type PaginationBaseProps } from '../types'

export type DataTablePaginationProps = {
	table: Table<any>
	manualPagination?: boolean
	enableInputPageSize?: boolean
	controlledPaginationProps: Partial<Omit<Pagination<any>, 'data'>>
	onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>
	[key: string]: any
} & PaginationBaseProps

const TablePagination: React.FC<DataTablePaginationProps> = ({
	table,
	loading,
	manualPagination,
	controlledPaginationProps,
	enableInputPageSize,
	onPaginationChange,
	prefetch
}) => {
	'use no memo'

	const { t } = useTranslation('ns_common')
	const { firstPage, lastPage, nextPage, previousPage, setPageSize } = table
	const intervalRef = useRef<NodeJS.Timeout>(null)
	const prefetchCountRef = useRef<number>(0)

	const canNextPage = manualPagination ? controlledPaginationProps?.hasNextPage : table.getCanNextPage()
	const canPreviousPage = manualPagination ? controlledPaginationProps?.hasPrevPage : table.getCanPreviousPage()
	const pageCount = manualPagination ? controlledPaginationProps?.totalPages : table.getPageCount()
	const pageSize = manualPagination ? controlledPaginationProps?.limit : table.getState().pagination.pageSize
	const pageIndex = manualPagination ? controlledPaginationProps?.page : table.getState().pagination.pageIndex + 1
	const rowCount = manualPagination ? controlledPaginationProps.totalDocs : table.getRowCount()

	const pageIndexContext = String(pageIndex ?? 1) + '/' + String(pageCount ?? 1)

	const changePageSize = (value: string) => {
		if (isNaN(+value)) return

		if (+value > rowCount) {
			goToFirstPage()
		}
		setPageSize(+value)
		if (manualPagination && typeof onPaginationChange === 'function')
			onPaginationChange({ pageIndex, pageSize: +value })
	}

	const goToNextPage = () => {
		if (!canNextPage) return
		if (manualPagination && typeof onPaginationChange === 'function')
			onPaginationChange({ pageIndex: pageIndex + 1, pageSize: pageSize })
		else nextPage()
	}

	const goToPrevPage = () => {
		if (!canPreviousPage) return
		if (manualPagination && typeof onPaginationChange === 'function')
			onPaginationChange({ pageIndex: pageIndex - 1, pageSize: pageSize })
		else previousPage()
	}

	const handlePrefetch = (params: AxiosRequestConfig['params'] & Pick<Pagination<any>, 'page' | 'limit'>) => {
		if (!manualPagination || typeof prefetch !== 'function') return
		prefetch(params)
	}

	useEffect(() => {
		if (!manualPagination || typeof prefetch !== 'function' || !('requestIdleCallback' in window) || !canNextPage)
			return

		window.requestIdleCallback(() => {
			intervalRef.current = setInterval(() => {
				prefetchCountRef.current++
				// Prefetch next 20 pages and will be cancelled on last page
				const canPrefetch = pageIndex + prefetchCountRef.current <= pageCount && prefetchCountRef.current <= 20
				if (!canPrefetch) {
					clearInterval(intervalRef.current)
					return
				}
				prefetch({ page: pageIndex + prefetchCountRef.current, limit: pageSize })
			}, 100)
		})

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
	}, [canNextPage])

	const goToFirstPage = () => {
		if (manualPagination && typeof onPaginationChange === 'function') {
			onPaginationChange({ pageIndex: 1, pageSize })
		} else {
			firstPage()
		}
	}

	const goToLastPage = () => {
		if (manualPagination && typeof onPaginationChange === 'function') {
			onPaginationChange({ pageIndex: pageCount, pageSize })
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
					readOnly={!enableInputPageSize}
					shouldFilter={false}
					className='w-24'
					datalist={[10, 20, 30, 40, 50].map((size) => ({ label: String(size), value: size }))}
					labelField='label'
					valueField='value'
				/>
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
						aria-label={t('ns_common:pagination.first_page')}
						disabled={!canPreviousPage || loading}
						variant='outline'
						size='icon'
						onClick={goToFirstPage}
						onPointerEnter={() => handlePrefetch({ limit: pageSize, page: 1 })}>
						<Icon name='ChevronsLeft' />
					</Button>
				</Tooltip>
				<Tooltip
					message={t('pagination.previous_page', { defaultValue: 'Previous page' })}
					triggerProps={{ asChild: true }}>
					<Button
						role='button'
						aria-disabled={!canPreviousPage || loading}
						aria-label={t('ns_common:pagination.previous_page')}
						disabled={!canPreviousPage || loading}
						variant='outline'
						size='icon'
						onClick={goToPrevPage}
						onPointerEnter={() => {
							if (canPreviousPage) handlePrefetch({ limit: pageSize, page: pageIndex - 1 })
						}}>
						<Icon name='ChevronLeft' />
					</Button>
				</Tooltip>
				<Tooltip
					message={t('pagination.next_page', { defaultValue: 'Next page' })}
					triggerProps={{ asChild: true }}>
					<Button
						role='button'
						aria-disabled={!canNextPage || loading}
						aria-label={t('ns_common:pagination.next_page')}
						disabled={!canNextPage || loading}
						variant='outline'
						size='icon'
						onClick={goToNextPage}
						onPointerEnter={() => {
							if (canNextPage) handlePrefetch({ limit: pageSize, page: pageIndex + 1 })
						}}>
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
						aria-label={t('ns_common:pagination.last_page')}
						disabled={!canNextPage || loading}
						variant='outline'
						size='icon'
						onClick={goToLastPage}
						onPointerEnter={() => handlePrefetch({ limit: pageSize, page: pageCount })}>
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
