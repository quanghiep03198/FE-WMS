import { factories, FALLBACK_VALUE } from '@/common/constants/constants'
import { IPackingManifest } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Badge, Button, DataTable, Icon } from '@/components/ui'
import EllipsisList from '@/components/ui/@custom/ellipsis-list'
import { DataTableProps } from '@/components/ui/@react-table/types'
import { PackingService } from '@/services/packing.service'
import { useQuery } from '@tanstack/react-query'
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

	const columnHelper = createColumnHelper<IPackingManifest>()

	const columns: DataTableProps<IPackingManifest>['columns'] = useMemo(
		() => [
			columnHelper.accessor('po', {
				header: t('ns_erp:fields.po'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'includesString',
				size: 200,
				meta: { align: 'left' },
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('brand_name', {
				header: t('ns_erp:fields.brand_name'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'equalsString',
				size: 200,
				meta: { align: 'left', filterVariant: 'select' },
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('shoes_style', {
				header: t('ns_erp:fields.shoestyle_codefactory'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				size: 200,
				meta: { align: 'left', filterVariant: 'select' },
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('color', {
				header: t('ns_erp:fields.color_sn'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'equalsString',
				size: 200,
				meta: { align: 'left', filterVariant: 'select' },
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('size_data', {
				header: 'Size',
				enableSorting: true,
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
						'Unknown'
					)
				}
			}),
			columnHelper.accessor('factory_code_produce', {
				header: t('ns_erp:fields.factory_code_produce'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				size: 120,
				meta: {
					filterVariant: 'select',
					facetedUniqueValues: Object.entries(factories).map(([key, val]) => ({
						label: t(val, { ns: 'ns_common', defaultValue: val }),
						value: key
					}))
				},
				cell: ({ getValue }) => {
					const factoryCode = getValue()
					return factoryCode
						? t(factories[factoryCode], { ns: 'ns_common', defaultValue: factoryCode })
						: 'Unknown'
				}
			}),
			columnHelper.accessor('standard_weight', {
				header: t('ns_erp:fields.standard_weight'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'inNumberRange',
				size: 200,
				meta: { align: 'right', filterVariant: 'range', cellDataType: 'number' },
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('actual_weight', {
				header: t('ns_erp:fields.actual_weight'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'inNumberRange',
				size: 200,
				meta: { align: 'right', filterVariant: 'range', cellDataType: 'number' },
				cell: ({ getValue }) => {
					const value = getValue()
					return typeof value === 'number' ? formatIntlNumber(getValue()) : FALLBACK_VALUE
				}
			}),
			columnHelper.accessor('target_box_qty', {
				header: t('ns_erp:fields.target_box_qty'),
				enableSorting: true,
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
								<Icon name='RotateCw' />
							</Button>
						</Fragment>
					)
				}
			}}
		/>
	)
}

export default ReportMasterTable
