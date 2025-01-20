import useQueryParams from '@/common/hooks/use-query-params'
import { IDailyInboundReport } from '@/common/types/entities'
import { Button, DataTable, Div, Icon, Tooltip, Typography } from '@/components/ui'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetInboundReport } from '../../_apis/use-report.api'
import { useGetDefaultTenantByFactory } from '../../_apis/use-tenacy.api'

const DailyInboundReport: React.FC = () => {
	const { data: tenant } = useGetDefaultTenantByFactory()
	const { searchParams } = useQueryParams<{ 'date.eq': string }>({
		'date.eq': format(new Date(), 'yyyy-MM-dd')
	})
	const { data, refetch, isLoading } = useGetInboundReport(tenant?.id, searchParams)
	const { t, i18n } = useTranslation()
	const columnHelper = createColumnHelper<IDailyInboundReport>()

	const columns = useMemo(
		() => [
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				size: 200,
				enableColumnFilter: true,
				enableSorting: true,
				enableMultiSort: true
			}),
			columnHelper.accessor('count', {
				header: t('ns_common:common_fields.total'),
				enableColumnFilter: true,
				enableSorting: true,
				enableMultiSort: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => new Intl.NumberFormat().format(getValue())
			}),
			columnHelper.accessor('is_exchanged', {
				header: t('ns_common:table.problem_arises'),
				enableColumnFilter: false,
				enableSorting: false,
				enableMultiSort: false,
				cell: ({ getValue }) => {
					const isExchanged = getValue()
					return isExchanged && <Icon name='Check' />
				}
			}),
			columnHelper.display({
				header: t('ns_common:common_fields.remark'),
				enableColumnFilter: false,
				enableSorting: false,
				enableMultiSort: false,
				filterFn: 'inNumberRange',
				cell: ({ row }) => {
					const isExchanged = row.original.is_exchanged
					return isExchanged && t('ns_inoutbound:errors.wrong_stamp')
				}
			})
		],
		[i18n.language]
	)

	return (
		<Div className='col-span-full lg:col-span-2 xl:col-span-2'>
			<DataTable
				data={data}
				loading={isLoading}
				columns={columns}
				enableColumnResizing={true}
				enableSorting={true}
				enableMultiSort={true}
				toolbarProps={{
					slotLeft: () => <Typography className='font-semibold'>Daily Inbound Report</Typography>,
					slotRight: () => (
						<Fragment>
							<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
								<Button variant='outline' size='icon' onClick={() => refetch()}>
									<Icon name='RotateCw' />
								</Button>
							</Tooltip>
						</Fragment>
					)
				}}
				containerProps={{
					style: { height: screen.availHeight / 2 }
				}}
			/>
		</Div>
	)
}

export default DailyInboundReport
