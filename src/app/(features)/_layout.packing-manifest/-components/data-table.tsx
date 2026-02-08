import { factories } from '@/common/constants/constants'
import { IPackingManifest } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Badge, Button, DataTable, Icon } from '@/components/ui'
import EllipsisList from '@/components/ui/@custom/ellipsis-list'
import TableCellText from '@/components/ui/@react-table/components/table-cell-text'
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
					return t(factories[factoryCode], { ns: 'ns_common', defaultValue: t('ns_common:titles.unknown') })
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
				cell: ({ getValue }) => {
					const value = getValue()
					return typeof value === 'number' ? formatIntlNumber(getValue()) : t('ns_common:titles.unknown')
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
