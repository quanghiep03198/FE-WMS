import { TRANSLATED_FACTORY } from '@common/constants/constants'
import formatIntlNumber from '@common/utils/format-intl-number'
import { default as DataTable } from '@components/addons/tanstack-table'
import TableCellText from '@components/addons/tanstack-table/components/table-cell-text'
import EllipsisList from '@components/customs/ellipsis-list'
import { Badge } from '@components/ui/badge'
import { Button } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import { Input } from '@components/ui/input'
import type { usePackingManifestList } from '@features/packing-manifest/hooks/use-packing-manifest-list'
import type { PackingManifestRow } from '@features/packing-manifest/types'
import { createColumnHelper } from '@tanstack/react-table'
import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const columnHelper = createColumnHelper<PackingManifestRow>()

const ReportMasterTable: React.FC<{ list: ReturnType<typeof usePackingManifestList> }> = ({ list }) => {
	const { t, i18n } = useTranslation()
	const { updateWeight, isUpdatingWeight, isUpdateError } = list

	const columns = useMemo(
		() => [
			columnHelper.accessor('po', {
				header: t('ns_erp:fields.po'),
				enableSorting: true,
				enableMultiSort: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'includesString',
				size: 200,
				meta: { align: 'left', filterDebounce: 400 },
				cell: TableCellText
			}),
			columnHelper.accessor('brand_name', {
				header: t('ns_erp:fields.brand_name'),
				enableSorting: true,
				enableMultiSort: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'equalsString',
				size: 200,
				meta: { align: 'left', filterDebounce: 400 },
				cell: TableCellText
			}),
			columnHelper.accessor('factory_shoes_style', {
				header: t('ns_erp:fields.factory_shoes_style'),
				enableSorting: true,
				enableMultiSort: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				size: 200,
				meta: { align: 'left', filterDebounce: 400 },
				cell: TableCellText
			}),
			columnHelper.accessor('color_sn', {
				header: t('ns_erp:fields.color_sn'),
				enableSorting: true,
				enableMultiSort: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'equalsString',
				size: 200,
				meta: { align: 'left', filterDebounce: 400 },
				cell: TableCellText
			}),
			columnHelper.accessor('packing_standard', {
				header: t('ns_erp:fields.packing_standard'),
				enableSorting: true,
				enableMultiSort: true,
				enableColumnFilter: false,
				enablePinning: true,
				filterFn: 'fuzzy',
				size: 200,
				maxSize: 400,
				meta: { align: 'left', filterDebounce: 400 },
				cell: ({ getValue }) => {
					const value = getValue()
					return typeof value === 'string' ? (
						<EllipsisList
							data={value.split(';')}
							threshhold={2}
							template={({ data }) => (
								<Badge className='whitespace-nowrap' variant='outline'>
									{data.trim().replace(/\((\d+)\)/, ' ($1 prs)')}
								</Badge>
							)}
						/>
					) : (
						t('ns_common:titles.unknown')
					)
				}
			}),
			columnHelper.accessor('factory_code_produce', {
				header: t('ns_erp:fields.factory_code_produce'),
				enableSorting: false,
				enableMultiSort: false,
				enableColumnFilter: false,
				enablePinning: false,
				size: 120,
				meta: { filterDebounce: 400 },
				cell: ({ getValue }) => {
					const factoryCode = getValue()
					return t(TRANSLATED_FACTORY[factoryCode], {
						ns: 'ns_common',
						defaultValue: t('ns_common:titles.unknown')
					})
				}
			}),
			columnHelper.accessor('standard_weight', {
				header: t('ns_erp:fields.standard_weight'),
				enableSorting: true,
				enableMultiSort: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'inNumberRange',
				size: 200,
				meta: { align: 'right', filterVariant: 'range', cellDataType: 'number', disableFacetedRangeLimits: true },
				cell: ({ getValue }) => {
					const value = getValue()
					return value === null ? t('ns_common:titles.unknown') : formatIntlNumber(value)
				}
			}),
			columnHelper.accessor('actual_avg_weight', {
				header: t('ns_erp:fields.actual_avg_weight'),
				enableSorting: true,
				enableMultiSort: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'inNumberRange',
				size: 200,
				meta: { align: 'right', filterVariant: 'range', cellDataType: 'number', disableFacetedRangeLimits: true },
				cell: ({ getValue, row }) => {
					const value = getValue()
					return (
						<Input
							aria-busy={isUpdatingWeight}
							aria-invalid={isUpdateError}
							className='aria-invalid:border-destructive block rounded-none border-none bg-inherit text-right shadow-none aria-busy:opacity-50'
							defaultValue={value ?? ''}
							disabled={!row.original.po}
							key={`${row.original.po}-${row.original.original_size_data}-${value}`}
							placeholder={t('ns_common:titles.unknown')}
							type='number'
							onBlur={(e) => {
								if (row.original.po && e.currentTarget.value && Number.parseFloat(e.target.value) !== value)
									updateWeight({
										po: row.original.po,
										size: row.original.original_size_data,
										actual_weight_in: Number.parseFloat(e.currentTarget.value)
									})
							}}
						/>
					)
				}
			}),
			columnHelper.accessor('target_box_qty', {
				header: t('ns_erp:fields.target_box_qty'),
				enableSorting: true,
				enableMultiSort: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'inNumberRange',
				size: 200,
				meta: { align: 'right', filterVariant: 'range', cellDataType: 'number', disableFacetedRangeLimits: true },
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('target_item_qty', {
				header: t('ns_erp:fields.target_item_qty'),
				enableSorting: true,
				enableMultiSort: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'inNumberRange',
				size: 200,
				meta: { align: 'right', filterVariant: 'range', cellDataType: 'number', disableFacetedRangeLimits: true },
				cell: ({ getValue }) => {
					const value = getValue()
					return value === null ? t('ns_common:titles.unknown') : formatIntlNumber(value)
				}
			}),
			columnHelper.accessor('weighed_box_qty', {
				header: t('ns_erp:fields.weighed_box_qty'),
				enableSorting: true,
				enableMultiSort: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'inNumberRange',
				size: 200,
				meta: { align: 'right', filterVariant: 'range', cellDataType: 'number', disableFacetedRangeLimits: true },
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),

			columnHelper.accessor('unweighed_box_qty', {
				header: t('ns_erp:fields.unweighed_box_qty'),
				enableSorting: true,
				enableMultiSort: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'inNumberRange',
				size: 200,
				meta: { align: 'right', filterVariant: 'range', cellDataType: 'number', disableFacetedRangeLimits: true },
				cell: ({ getValue }) => formatIntlNumber(getValue())
			})
		],
		[t, i18n.language, isUpdatingWeight, isUpdateError, updateWeight]
	)

	const total = list.data?.total ?? 0
	const totalPages = Math.max(1, Math.ceil(total / list.pagination.pageSize))
	return (
		<>
			{list.isError && <p role='alert'>{t('ns_packing:manifest.list_error')}</p>}
			<DataTable
				manualFiltering
				manualPagination
				manualSorting
				columnFilters={list.columnFilters}
				columns={columns}
				data={list.data?.items}
				enableGlobalFilter={false}
				enableMultiSort={false}
				loading={list.isLoading}
				sorting={list.sorting}
				containerProps={{
					style: { height: 'calc(var(--outlet-wrapper-height) - 12.5rem)' }
				}}
				initialState={{
					pagination: {
						pageIndex: 0,
						pageSize: 20
					}
				}}
				paginationProps={{
					variant: 'default',
					page: list.pagination.page,
					limit: list.pagination.pageSize,
					totalDocs: total,
					totalPages,
					hasPrevPage: list.pagination.page > 1,
					hasNextPage: !list.isPlaceholderData && list.pagination.page < totalPages
				}}
				toolbarProps={{
					slotRight: () => {
						return (
							<Fragment>
								<Button size='icon' variant='outline' onClick={() => list.refetch()}>
									<Icon name='RefreshCcw' />
								</Button>
							</Fragment>
						)
					}
				}}
				onColumnFiltersChange={list.onColumnFiltersChange}
				onPaginationChange={list.onPaginationChange}
				onSortingChange={list.onSortingChange}
			/>
		</>
	)
}

export default ReportMasterTable
