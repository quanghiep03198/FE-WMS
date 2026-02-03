import { factories } from '@/common/constants/constants'
import useAuth from '@/common/hooks/use-auth'
import useQueryParams from '@/common/hooks/use-query-params'
import { IPackingReport } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Button, DataTable, Icon } from '@/components/ui'
import TableCellText from '@/components/ui/@react-table/components/table-cell-text'
import { DataTableProps } from '@/components/ui/@react-table/types'
import { ReportService } from '@/services/report.service'
import { useQuery } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'
import { pick } from 'lodash-es'
import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import AutoRefreshToggle from '../../-components/shared/auto-refresh-toggle'

const ReportMasterTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const { user } = useAuth()
	const { searchParams } = useQueryParams<{ 'date.eq': string; 'auto-refresh': number | false }>({
		'date.eq': format(new Date(), 'yyyy-MM-dd'),
		'auto-refresh': false
	})
	const { data, isLoading, refetch } = useQuery({
		queryKey: ['PACKING_REPORT', pick(searchParams, 'date.eq')],
		queryFn: () => ReportService.getDailyWeighingReport(pick(searchParams, 'date.eq')),
		refetchInterval: searchParams['auto-refresh'],
		select: (response) => response.metadata
	})

	const columnHelper = createColumnHelper<IPackingReport>()

	const columns: DataTableProps<IPackingReport>['columns'] = useMemo(
		() => [
			columnHelper.accessor('brand_name', {
				header: t('ns_erp:fields.brand_name'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				size: 200,
				meta: { align: 'left' },
				cell: TableCellText
			}),
			columnHelper.accessor('po', {
				header: t('ns_erp:fields.po'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'includesString',
				size: 200,
				meta: { align: 'left' },
				cell: TableCellText
			}),
			columnHelper.accessor('factory_shoes_style', {
				header: t('ns_erp:fields.factory_shoes_style'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				size: 200,
				meta: { align: 'left' },
				cell: TableCellText
			}),
			columnHelper.accessor('color_sn', {
				header: t('ns_erp:fields.color_sn'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				size: 200,
				meta: { align: 'left' },
				cell: TableCellText
			}),
			columnHelper.accessor('size_data', {
				header: 'Size',
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				size: 200,
				meta: { align: 'left' },
				cell: TableCellText
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

	const handleDownloadExcel = async () => {
		const id = toast.loading(t('ns_common:notification.downloading'))
		try {
			const blob = await ReportService.downloadWeighingReport(searchParams)
			saveAs(
				blob,
				t('ns_packing:titles.file_daily_weighing_report', {
					factory: t(factories[user?.current_factory_code], { ns: 'ns_common' }),
					date: searchParams['date.eq'],
					defaultValue: `Packing weight Report ~ ${format(new Date(), 'yyyy-MM-dd')}`
				}) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id })
		} catch {
			toast.error('ns_common:notification.error', { id })
		}
	}

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
			containerProps={{ className: 'xxl:h-[60vh] h-[50vh]' }}
			toolbarProps={{
				slotLeft: () => <AutoRefreshToggle />,
				slotRight: () => {
					return (
						<Fragment>
							<Button variant='outline' size='icon' onClick={() => handleDownloadExcel()}>
								<Icon name='Download' />
							</Button>
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
