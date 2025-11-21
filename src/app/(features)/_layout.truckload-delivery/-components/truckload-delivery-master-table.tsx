import useMediaQuery from '@/common/hooks/use-media-query'
import { useReactiveRef } from '@/common/hooks/use-reactive-ref'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Badge, BadgeProps, DataTable, Div, Icon, IconProps, Tooltip, Typography } from '@/components/ui'
import { ROW_ACTIONS_COLUMN_ID, ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { createColumnHelper, Table as TanstackTable } from '@tanstack/react-table'
import { format } from 'date-fns'
import { pick } from 'lodash'
import { useLayoutEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TruckloadDeliveryStatus } from '../-constants'
import { useGetTruckloadDeliveryQuery } from '../-hooks/use-truckload-delivery-asm'
import RowActions from './row-actions'
import TruckloadDeliveryDetailTable from './truckload-delivery-detail-table'
import TruckloadDeliveryTableToolbar from './truckload-delivery-table-toolbar'

const TruckloadDeliveryMasterTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const isMobile = useMediaQuery('(max-width: 1023px)')
	const tableRef = useReactiveRef<TanstackTable<ITruckloadDelivery>>(null)
	const { data, isLoading } = useGetTruckloadDeliveryQuery()

	const columnHelper = createColumnHelper<ITruckloadDelivery>()

	const columns = useMemo(
		() => [
			columnHelper.display({
				id: ROW_EXPANSION_COLUMN_ID,
				header: ({ table }) => (
					<Tooltip message={t('ns_common:actions.fold')} triggerProps={{ asChild: true }}>
						<button
							className='absolute inset-0 flex h-full w-full items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-foreground'
							onClick={() => table.toggleAllRowsExpanded(false)}>
							<Icon name='ListCollapse' size={18} />
						</button>
					</Tooltip>
				),
				size: 50,
				maxSize: 50,
				enableHiding: false,
				cell: ({ row, table }) => (
					<button
						className='absolute inset-0 flex h-full w-full items-center justify-center'
						onClick={() => {
							table.toggleAllRowsExpanded(false)
							row.toggleExpanded(!row.getIsExpanded())
						}}>
						<Icon name={row.getIsExpanded() ? 'ChevronDown' : 'ChevronRight'} />
					</button>
				)
			}),
			columnHelper.accessor('dispatch_order', {
				header: t('ns_erp:fields.dispatch_order'),
				enableResizing: true,
				enableSorting: true,
				enableColumnFilter: true,
				meta: { hidden: isMobile },
				filterFn: 'includesStringSensitive',
				minSize: 225,
				size: 225,
				maxSize: 225
			}),
			columnHelper.accessor('license_plate', {
				header: t('ns_erp:fields.license_plate'),
				enableResizing: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				enableGlobalFilter: true,
				cell: ({ getValue }) => {
					const value = getValue()
					if (!value)
						return (
							<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
								<Icon name='Truck' />
								{t('ns_common:titles.unknown')}
							</Typography>
						)

					return value
				}
			}),
			columnHelper.accessor('container_number', {
				header: !isMobile
					? t('ns_erp:fields.container_number')
					: t('ns_erp:fields.license_plate') + ' / ' + t('ns_erp:fields.container_number'),
				enableResizing: true,
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: true,
				filterFn: 'auto',
				minSize: 150,
				size: isMobile ? 225 : 200,
				maxSize: 250,
				cell: ({ row, getValue }) => {
					const value = getValue()
					if (!value)
						return (
							<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
								<Icon name='Container' />
								{t('ns_common:titles.unknown')}
							</Typography>
						)
					if (!isMobile) return value
					return (
						<Div className='flex flex-col space-y-1'>
							<Typography variant='small' className='inline-grid grid-cols-[auto_1fr] gap-x-2 font-medium'>
								<Icon name='Truck' className='self-center stroke-muted-foreground' />
								{row.original.license_plate}
								<Typography
									variant='small'
									color='muted'
									className='col-start-2 inline-grid grid-cols-[auto_1fr] gap-x-2 font-normal'>
									{row.original.container_number}
								</Typography>
							</Typography>
						</Div>
					)
				}
			}),
			columnHelper.accessor('purchase_orders', {
				filterFn: 'arrIncludes'
			}),
			columnHelper.accessor('total_outbound_qty', {
				header: t('ns_erp:fields.outbound_qty'),
				enableSorting: true,
				cell: ({ getValue }) => formatIntlNumber(getValue() as number)
			}),
			columnHelper.accessor('status', {
				header: t('ns_common:common_fields.status'),
				enableResizing: true,
				enableSorting: true,
				enablePinning: true,
				enableColumnFilter: true,
				enableGlobalFilter: false,
				filterFn: 'equals',
				minSize: 200,
				size: isMobile ? 150 : 200,
				maxSize: 200,
				cell: ({ getValue }) => {
					const value = getValue() as TruckloadDeliveryStatus
					const badgeVariants: Record<TruckloadDeliveryStatus, BadgeProps['variant']> = {
						[TruckloadDeliveryStatus.PENDING]: 'outline',
						[TruckloadDeliveryStatus.CONFIRMED]: 'default',
						[TruckloadDeliveryStatus.REQUEST_CHANGE]: 'destructive'
					}
					const statusIconVariants: Record<TruckloadDeliveryStatus, IconProps['name']> = {
						[TruckloadDeliveryStatus.PENDING]: 'CircleDotDashed',
						[TruckloadDeliveryStatus.CONFIRMED]: 'CircleCheckBig',
						[TruckloadDeliveryStatus.REQUEST_CHANGE]: 'Undo2'
					}

					return (
						<Badge variant={badgeVariants[value] ?? 'secondary'}>
							<Icon name={statusIconVariants[value] ?? 'CircleDotDashed'} size={14} strokeWidth={2.5} />
							{t(`ns_common:status.${value}`)}
						</Badge>
					)
				}
			}),
			columnHelper.accessor('factory_departure_time', {
				header: t('ns_erp:fields.factory_departure_time'),
				enableResizing: true,
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: false,
				minSize: 150,
				size: 200,
				maxSize: 250,
				cell: ({ getValue }) => {
					const factoryDepartureTime = getValue()
					return factoryDepartureTime ? (
						format(new Date(factoryDepartureTime), 'yyyy-MM-dd HH:mm')
					) : (
						<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
							<Icon name='ClockAlert' stroke='hsl(var(--muted-foreground))' />
							{t('ns_common:titles.unknown')}
						</Typography>
					)
				}
			}),
			columnHelper.display({
				id: ROW_ACTIONS_COLUMN_ID,
				enableResizing: false,
				enableSorting: false,
				enableGlobalFilter: false,
				enableColumnFilter: false,
				size: isMobile ? 100 : 250,
				maxSize: 250,
				meta: { align: 'right' },
				cell: ({ row }) => {
					return (
						<RowActions
							data={pick(row.original, ['dispatch_order', 'license_plate', 'container_number', 'status'])}
						/>
					)
				}
			})
		],
		[i18n.language, isMobile]
	)

	useLayoutEffect(() => {
		if (tableRef.current) {
			tableRef.current.setColumnVisibility({
				...tableRef.current.getState().columnVisibility,
				license_plate: !isMobile,
				total_outbound_qty: !isMobile,
				factory_departure_time: !isMobile
			})
			tableRef.current.setColumnPinning({
				left: [ROW_EXPANSION_COLUMN_ID, ...(isMobile ? ['container_number'] : [])],
				right: [ROW_ACTIONS_COLUMN_ID]
			})
		}
	}, [tableRef.current, isMobile])

	return (
		<DataTable
			ref={tableRef}
			columns={columns}
			data={data}
			loading={isLoading}
			enableColumnFilters={true}
			border='bottom-only'
			initialState={{
				pagination: {
					pageIndex: 0,
					pageSize: 50
				},
				columnVisibility: {
					purchase_orders: false,
					license_plate: !isMobile,
					total_outbound_qty: !isMobile,
					factory_departure_time: !isMobile
				},
				columnPinning: {
					left: [ROW_EXPANSION_COLUMN_ID],
					right: [...(isMobile ? ['container_number'] : []), ROW_ACTIONS_COLUMN_ID]
				}
			}}
			virtualizerOptions={{
				estimateSize: isMobile ? 80 : 40,
				overscan: 10
			}}
			toolbarProps={{
				override: true,
				render: (props) => <TruckloadDeliveryTableToolbar {...props} />
			}}
			containerProps={{
				className: 'h-[65vh]'
			}}
			renderSubComponent={({ row }) => {
				const data = row.original as ITruckloadDelivery
				return (
					<TruckloadDeliveryDetailTable data={data} onCollapse={() => row.toggleExpanded(!row.getIsExpanded())} />
				)
			}}
		/>
	)
}

export default TruckloadDeliveryMasterTable
