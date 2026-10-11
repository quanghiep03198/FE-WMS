import type { PaginationState, Table } from '@tanstack/react-table'
import type { AxiosRequestConfig } from 'axios'
import React, { memo, useEffect, useRef } from 'react'
import isEqual from 'react-fast-compare'
import { useTranslation } from 'react-i18next'
import AutoComplete from '../../../customs/auto-complete'
import { Div } from '../../../customs/div'
import Pagination from '../../../customs/pagination'
import { Tooltip } from '../../../customs/tooltip'
import { Typography } from '../../../customs/typography'
import { Button } from '../../../ui/button'
import { ButtonGroup } from '../../../ui/button-group'
import { Icon } from '../../../ui/icon'
import { Label } from '../../../ui/label'
import { Separator } from '../../../ui/separator'
import { type PaginationBaseProps } from '../types'

export type DataTablePaginationProps = {
	table: Table<any>
	variant?: 'default' | 'numbered'
	manualPagination?: boolean
	enableInputPageSize?: boolean
	controlledPaginationProps: Partial<Omit<Pagination<any>, 'data'>>
	onPaginationChange?: React.Dispatch<React.SetStateAction<PaginationState>>
	[key: string]: any
} & PaginationBaseProps

const TablePagination: React.FC<DataTablePaginationProps> = ({
	table,
	loading,
	variant = 'default',
	manualPagination,
	controlledPaginationProps,
	enableInputPageSize,
	onPaginationChange,
	prefetch
}) => {
	'use no memo'

	const { t } = useTranslation()
	const { firstPage, lastPage, nextPage, previousPage, setPageSize } = table

	const canNextPage = manualPagination ? controlledPaginationProps?.hasNextPage : table.getCanNextPage()
	const canPreviousPage = manualPagination ? controlledPaginationProps?.hasPrevPage : table.getCanPreviousPage()
	const pageCount =
		manualPagination && typeof controlledPaginationProps?.totalPages === 'number'
			? controlledPaginationProps?.totalPages
			: table.getPageCount()
	const pageSize =
		manualPagination && typeof controlledPaginationProps?.limit === 'number'
			? controlledPaginationProps?.limit
			: table.getState().pagination.pageSize
	const pageIndex =
		manualPagination && typeof controlledPaginationProps?.page === 'number'
			? controlledPaginationProps?.page
			: table.getState().pagination.pageIndex + 1
	const rowCount =
		manualPagination && typeof controlledPaginationProps?.totalDocs === 'number'
			? controlledPaginationProps.totalDocs
			: table.getRowCount()

	const pageIndexContext = String(pageIndex ?? 1) + '/' + String(pageCount ?? 1)

	const timer = useRef<NodeJS.Timeout | null>(null)

	const changePageSize = (value: string) => {
		if (Number.isNaN(+value)) return

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
		if (!manualPagination || typeof prefetch !== 'function' || !canNextPage) return
		timer.current = setTimeout(() => prefetch(params), 120)
	}

	const cancelPrefetch = () => {
		if (timer.current) {
			clearTimeout(timer.current)
			timer.current = null
		}
	}

	// useEffect(() => {
	// 	if (typeof pageIndex !== 'number' && typeof pageSize !== 'number') return
	// 	handlePrefetch({ page: pageIndex + 1, limit: pageSize })
	// }, [canNextPage, pageIndex, pageSize])

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

	if (variant === 'numbered')
		return (
			<Pagination
				data-variant={variant}
				hasNextPage={!!canNextPage}
				hasPrevPage={!!canPreviousPage}
				limit={pageSize}
				nextPage={canNextPage ? pageIndex + 1 : null}
				page={pageIndex}
				prevPage={canPreviousPage ? pageIndex - 1 : null}
				totalDocs={rowCount}
				totalPages={pageCount}
				onPageChange={(page) => onPaginationChange?.({ pageIndex: page, pageSize })}
			/>
		)
	return (
		<Div
			as='nav'
			className='ml-auto flex items-center space-x-2 py-0.5 sm:space-x-2 lg:space-x-4 xl:space-x-4'
			data-variant={variant}
			role='navigation'>
			<Div className='flex items-center space-x-2'>
				<Label className='font-medium whitespace-nowrap'>{t('ns_common:table.rows_per_page')}</Label>
				<AutoComplete
					className='w-24'
					datalist={[10, 20, 30, 40, 50].map((size) => ({ label: String(size), value: size }))}
					defaultValue={10}
					labelField='label'
					min={10}
					placeholder={'0'}
					readOnly={!enableInputPageSize}
					shouldFilter={false}
					type='number'
					value={pageSize === 1 ? undefined : pageSize}
					valueField='value'
					onInput={(value) => changePageSize(value)}
					onSelect={(value) => changePageSize(value)}
				/>
			</Div>
			<Separator className='bg-border h-6 w-1 sm:hidden md:hidden' orientation='vertical' />
			<Typography className='text-center font-medium whitespace-nowrap' variant='small'>
				{t('table.page', {
					ns: 'ns_common',
					defaultValue: pageIndexContext,
					page: pageIndexContext
				})}
			</Typography>
			<Separator className='bg-border h-6 w-1 sm:hidden md:hidden' orientation='vertical' />
			<ButtonGroup>
				<Tooltip
					message={t('pagination.first_page', { defaultValue: 'First page' })}
					triggerProps={{ asChild: true }}>
					<Button
						aria-disabled={!canPreviousPage || loading}
						aria-label={t('ns_common:pagination.first_page')}
						disabled={!canPreviousPage || loading}
						role='button'
						size='icon'
						variant='outline'
						onClick={goToFirstPage}
						onPointerEnter={() => handlePrefetch({ limit: pageSize, page: 1 })}
						onPointerLeave={cancelPrefetch}>
						<Icon name='ChevronsLeft' />
					</Button>
				</Tooltip>
				<Tooltip
					message={t('pagination.previous_page', { defaultValue: 'Previous page' })}
					triggerProps={{ asChild: true }}>
					<Button
						aria-disabled={!canPreviousPage || loading}
						aria-label={t('ns_common:pagination.previous_page')}
						disabled={!canPreviousPage || loading}
						role='button'
						size='icon'
						variant='outline'
						onClick={goToPrevPage}
						onPointerLeave={cancelPrefetch}
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
						aria-disabled={!canNextPage || loading}
						aria-label={t('ns_common:pagination.next_page')}
						disabled={!canNextPage || loading}
						role='button'
						size='icon'
						variant='outline'
						onClick={goToNextPage}
						onPointerLeave={cancelPrefetch}
						onPointerEnter={() => {
							if (canNextPage) handlePrefetch({ limit: pageSize, page: pageIndex + 1 })
						}}>
						<Icon name='ChevronRight' />
					</Button>
				</Tooltip>
				<Tooltip
					contentProps={{ align: 'end' }}
					message={t('pagination.last_page', { defaultValue: 'Last page' })}
					triggerProps={{ asChild: true }}>
					<Button
						aria-disabled={!canNextPage || loading}
						aria-label={t('ns_common:pagination.last_page')}
						disabled={!canNextPage || loading}
						role='button'
						size='icon'
						variant='outline'
						onClick={goToLastPage}
						onPointerEnter={() => handlePrefetch({ limit: pageSize, page: pageCount })}
						onPointerLeave={cancelPrefetch}>
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
