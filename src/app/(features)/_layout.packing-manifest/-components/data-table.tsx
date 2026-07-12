import { Badge, Button, DataTable, Icon, Input } from '@/components/ui'
import EllipsisList from '@/components/ui/@custom/ellipsis-list'
import TableCellText from '@/components/ui/@react-table/components/table-cell-text'
import type { IPackingManifest } from '@/features/packing-manifest/types'
import { PackingService } from '@/services/packing.service'
import { TRANSLATED_FACTORY } from '@common/constants/constants'
import formatIntlNumber from '@common/utils/format-intl-number'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const ReportMasterTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const { data, isLoading, refetch } = useQuery({
		queryKey: ['PACKING_MANIFEST'],
		queryFn: () => PackingService.getPackingManifest(),
		select: (response) => response.metadata
	})

	const queryClient = useQueryClient()

	const { mutateAsync, isPending, isError } = useMutation({
		mutationFn: (payload: { po: string; size: string; actual_weight_in: number }) =>
			PackingService.bulkUpdatePacking(payload),
		onMutate: async (variables) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: ['PACKING_MANIFEST'] })

			// Snapshot the previous value
			const previousData = queryClient.getQueryData<ResponseBody<IPackingManifest[]>>(['PACKING_MANIFEST'])

			// Optimistically update to the new value
			queryClient.setQueryData<ResponseBody<IPackingManifest[]>>(['PACKING_MANIFEST'], (oldData) => {
				if (!oldData) return oldData
				return {
					...oldData,
					metadata: oldData.metadata.map((item) => {
						if (item.po === variables.po && item.original_size_data === variables.size)
							return { ...item, ...variables }
						return item
					})
				}
			})

			// Return a context object with the snapshotted value
			return { previousData }
		},
		onError: (_error, _variables, context) => {
			if (context && context.previousData) {
				queryClient.setQueryData<ResponseBody<IPackingManifest[]>>(['PACKING_MANIFEST'], context.previousData)
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ predicate: ({ queryKey }) => queryKey.includes('PACKING_MANIFEST') })
		}
	})

	const columnHelper = createColumnHelper<IPackingManifest>()

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
				meta: { align: 'left' },
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
				meta: { align: 'left', filterVariant: 'select' },
				cell: TableCellText
			}),
			columnHelper.accessor('shoes_style', {
				header: t('ns_erp:fields.factory_shoes_style'),
				enableSorting: true,
				enableMultiSort: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				size: 200,
				meta: { align: 'left', filterVariant: 'select' },
				cell: TableCellText
			}),
			columnHelper.accessor('color', {
				header: t('ns_erp:fields.color_sn'),
				enableSorting: true,
				enableMultiSort: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'equalsString',
				size: 200,
				meta: { align: 'left', filterVariant: 'select' },
				cell: TableCellText
			}),
			columnHelper.accessor('size_data', {
				header: 'Size',
				enableSorting: true,
				enableMultiSort: true,
				enableColumnFilter: false,
				enablePinning: true,
				filterFn: 'fuzzy',
				size: 200,
				maxSize: 400,
				meta: { align: 'left' },
				cell: ({ getValue }) => {
					const value = getValue()
					return typeof value === 'string' ? (
						<EllipsisList
							data={value.split(';')}
							template={({ data }) => (
								<Badge variant='outline' className='whitespace-nowrap'>
									{data.trim().replace(/\((\d+)\)/, ' ($1 prs)')}
								</Badge>
							)}
							threshhold={2}
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
				meta: { align: 'right', filterVariant: 'range', cellDataType: 'number' },
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('actual_avg_weight', {
				header: t('ns_erp:fields.actual_avg_weight'),
				enableSorting: true,
				enableMultiSort: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'inNumberRange',
				size: 200,
				meta: { align: 'right', filterVariant: 'range', cellDataType: 'number' },
				cell: ({ getValue, row }) => {
					const value = getValue()
					return (
						<Input
							aria-busy={isPending}
							aria-invalid={isError}
							className='aria-invalid:border-destructive block rounded-none border-none bg-inherit text-right shadow-none aria-busy:opacity-50'
							placeholder={t('ns_common:titles.unknown')}
							defaultValue={value}
							type='number'
							onBlur={(e) => {
								if (e.currentTarget.value && Number.parseFloat(e.target.value) !== value)
									mutateAsync({
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
				meta: { align: 'right', filterVariant: 'range', cellDataType: 'number' },
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
				meta: { align: 'right', filterVariant: 'range', cellDataType: 'number' },
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('weighed_box_qty', {
				header: t('ns_erp:fields.weighed_box_qty'),
				enableSorting: true,
				enableMultiSort: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'inNumberRange',
				size: 200,
				meta: { align: 'right', filterVariant: 'range', cellDataType: 'number' },
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
				meta: { align: 'right', filterVariant: 'range', cellDataType: 'number' },
				cell: ({ getValue }) => formatIntlNumber(getValue())
			})
		],
		[i18n.language]
	)

	return (
		<DataTable
			data={data}
			columns={columns}
			loading={isLoading}
			enableMultiSort={true}
			containerProps={{
				style: { height: 'calc(var(--outlet-wrapper-height) - 12.5rem)' }
			}}
			initialState={{
				pagination: {
					pageIndex: 0,
					pageSize: 50
				}
			}}
			toolbarProps={{
				slotRight: () => {
					return (
						<Fragment>
							<Button variant='outline' size='icon' onClick={() => refetch()}>
								<Icon name='RefreshCcw' />
							</Button>
						</Fragment>
					)
				}
			}}
		/>
	)
}

export default ReportMasterTable
