// import { PresetBreakPoints } from '@/common/constants/enums'
// import { useDateLocale } from '@/common/hooks/use-date-locale'
// import useMediaQuery from '@/common/hooks/use-media-query'
// import { useReactiveRef } from '@/common/hooks/use-reactive-ref'
// import formatIntlNumber from '@/common/utils/format-intl-number'
// import { Badge, BadgeProps, Button, DataTable, Div, Icon, IconProps, Typography } from '@/components/ui'
// import { ROW_ACTIONS_COLUMN_ID } from '@/components/ui/@react-table/constants'
// import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
// import { createColumnHelper, Table } from '@tanstack/react-table'
// import { format, formatRelative } from 'date-fns'
// import { useMemo } from 'react'
// import { useTranslation } from 'react-i18next'
// import { TruckloadDeliveryStatus } from '../-constants'
// import { useGetTruckloadDeliveryQuery } from '../-hooks/use-truckload-delivery-asm'
// import GlobalFilterInput from './global-filter-input'
// import PurchaseOrderFilterInput from './purchase-order-filter-input'
// import RowActionsDropdown from './row-actions-dropdown'
// import StatusDropdownMenu from './truckload-delivery-status-filter'

// const TruckloadDeliveryTable: React.FC = () => {
// 	const { t, i18n } = useTranslation()
// 	const columnHelper = createColumnHelper<ITruckloadDelivery>()
// 	const isMediumScreen = useMediaQuery(PresetBreakPoints.MEDIUM)
// 	const tableRef = useReactiveRef<Table<ITruckloadDelivery>>(null)
// 	const { data, isLoading, refetch } = useGetTruckloadDeliveryQuery()
// 	const dateLocale = useDateLocale()

// 	const columns = useMemo(
// 		() => [
// 			columnHelper.accessor('license_plate', {
// 				header: t('ns_erp:fields.license_plate'),
// 				enableResizing: true,
// 				enableSorting: true,
// 				enableColumnFilter: true,
// 				meta: { hidden: isMediumScreen },
// 				filterFn: 'includesStringSensitive',
// 				minSize: 150,
// 				maxSize: 200,
// 				cell: ({ getValue }) => {
// 					const value = getValue()
// 					if (!value)
// 						return (
// 							<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
// 								<Icon name='RectangleEllipsis' />
// 								{t('ns_common:titles.unknown')}
// 							</Typography>
// 						)
// 					return value
// 				}
// 			}),
// 			columnHelper.accessor('container_number', {
// 				header: t('ns_erp:fields.container_number'),
// 				enableResizing: true,
// 				enableSorting: true,
// 				enableColumnFilter: true,
// 				filterFn: 'fuzzy',
// 				minSize: 150,
// 				maxSize: 200,
// 				cell: ({ row, getValue }) => {
// 					const value = getValue()
// 					if (!value)
// 						return (
// 							<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
// 								<Icon name='Container' />
// 								{t('ns_common:titles.unknown')}
// 							</Typography>
// 						)
// 					if (!isMediumScreen) return value
// 					return (
// 						<Div className='flex flex-col space-y-0.5'>
// 							<Typography variant='small' className='font-medium'>
// 								{row.original.license_plate}
// 							</Typography>
// 							<Typography variant='small' color='muted'>
// 								{row.original.container_number}
// 							</Typography>
// 						</Div>
// 					)
// 				}
// 			}),
// 			columnHelper.accessor('po', {
// 				header: t('ns_erp:fields.po'),
// 				enableResizing: true,
// 				enableSorting: true,
// 				enableColumnFilter: true,
// 				enableGlobalFilter: isMediumScreen,
// 				filterFn: 'fuzzy',
// 				minSize: 150,
// 				maxSize: 200,
// 				cell: ({ row, getValue }) => {
// 					if (!isMediumScreen) return getValue()
// 					return (
// 						<Div className='flex flex-col space-y-0.5'>
// 							<Typography variant='small' className='font-medium'>
// 								{row.original.po}
// 							</Typography>
// 							<Typography variant='small' color='muted'>
// 								{formatIntlNumber(row.original.outbound_qty)} (prs)
// 							</Typography>
// 						</Div>
// 					)
// 				}
// 			}),
// 			columnHelper.accessor('outbound_qty', {
// 				header: t('ns_erp:fields.outbound_qty'),
// 				enableResizing: true,
// 				enableSorting: true,
// 				enableColumnFilter: true,
// 				enableGlobalFilter: false,
// 				minSize: 150,
// 				maxSize: 200,
// 				meta: { hidden: isMediumScreen },
// 				cell: ({ getValue }) => formatIntlNumber(getValue())
// 			}),
// 			columnHelper.accessor('user_code_created', {
// 				header: 'Created by',
// 				enableResizing: true,
// 				enableSorting: true,
// 				enableColumnFilter: true,
// 				enableGlobalFilter: false,
// 				minSize: 150,
// 				size: 225,
// 				maxSize: 250,
// 				cell: ({ getValue, row }) => (
// 					<Div className='flex flex-col space-y-0.5'>
// 						<Typography variant='small' className='before:content-["@"]'>
// 							{getValue()}
// 						</Typography>
// 						<Typography variant='small' color='muted' className='line-clamp-1 first-letter:uppercase'>
// 							{formatRelative(row.original.created, new Date(), { locale: dateLocale }) as string}
// 						</Typography>
// 					</Div>
// 				)
// 			}),
// 			columnHelper.accessor('status', {
// 				header: t('ns_common:common_fields.status'),
// 				enableResizing: true,
// 				enableSorting: true,
// 				enablePinning: true,
// 				enableColumnFilter: true,
// 				enableGlobalFilter: false,
// 				filterFn: 'equals',
// 				minSize: 150,
// 				maxSize: 200,
// 				cell: ({ getValue }) => {
// 					const value = getValue() as TruckloadDeliveryStatus
// 					const badgeVariants: Record<TruckloadDeliveryStatus, BadgeProps['variant']> = {
// 						[TruckloadDeliveryStatus.PENDING]: 'outline',
// 						[TruckloadDeliveryStatus.CONFIRMED]: 'default',
// 						[TruckloadDeliveryStatus.REQUEST_CHANGE]: 'destructive'
// 					}
// 					const statusIconVariants: Record<TruckloadDeliveryStatus, IconProps['name']> = {
// 						[TruckloadDeliveryStatus.PENDING]: 'CircleDotDashed',
// 						[TruckloadDeliveryStatus.CONFIRMED]: 'CircleCheckBig',
// 						[TruckloadDeliveryStatus.REQUEST_CHANGE]: 'UndoDot'
// 					}

// 					return (
// 						<Badge variant={badgeVariants[value] ?? 'secondary'}>
// 							<Icon name={statusIconVariants[value] ?? 'CircleDotDashed'} />
// 							{t(`ns_common:status.${value}`)}
// 						</Badge>
// 					)
// 				}
// 			}),
// 			columnHelper.accessor('factory_departure_time', {
// 				header: t('ns_erp:fields.factory_departure_time'),
// 				enableResizing: true,
// 				enableSorting: true,
// 				enableColumnFilter: true,
// 				enableGlobalFilter: false,
// 				filterFn: 'inDateRange',
// 				minSize: 150,
// 				size: 225,
// 				maxSize: 250,
// 				meta: {
// 					filterVariant: 'date'
// 				},
// 				cell: ({ getValue }) => {
// 					const factoryDepartureTime = getValue()
// 					return factoryDepartureTime ? (
// 						format(new Date(factoryDepartureTime), 'yyyy-MM-dd HH:mm')
// 					) : (
// 						<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
// 							<Icon name='ClockAlert' stroke='hsl(var(--muted-foreground))' />
// 							{t('ns_common:titles.unknown')}
// 						</Typography>
// 					)
// 				}
// 			}),
// 			columnHelper.display({
// 				id: ROW_ACTIONS_COLUMN_ID,
// 				header: '-',
// 				enableResizing: false,
// 				enableSorting: false,
// 				enableGlobalFilter: false,
// 				enableColumnFilter: false,
// 				size: 60,
// 				maxSize: 60,
// 				meta: { align: 'center' },
// 				cell: ({ row }) => {
// 					return <RowActionsDropdown data={row.original} />
// 				}
// 			})
// 		],
// 		[i18n.language, isMediumScreen]
// 	)

// 	return (
// 		<DataTable
// 			ref={tableRef}
// 			columns={columns}
// 			data={data}
// 			loading={isLoading}
// 			border='bottom-only'
// 			initialState={{
// 				pagination: {
// 					pageIndex: 0,
// 					pageSize: 50
// 				},
// 				columnPinning: {
// 					left: [],
// 					right: ['status', ROW_ACTIONS_COLUMN_ID]
// 				}
// 			}}
// 			virtualizerOptions={{
// 				estimateSize: 80,
// 				overscan: 10
// 			}}
// 			toolbarProps={{
// 				override: true,
// 				render: ({ table, event$ }) => {
// 					const { globalFilter, columnFilters } = table.getState()
// 					const isFilterDirty = globalFilter?.length !== 0 || columnFilters?.length !== 0

// 					return (
// 						<Div className='flex items-center gap-x-1'>
// 							<GlobalFilterInput {...{ table, event$ }} />
// 							{!isMediumScreen && <PurchaseOrderFilterInput table={table} />}
// 							<StatusDropdownMenu table={table} />
// 							<Div className='ml-auto flex items-center justify-end gap-x-1'>
// 								{isFilterDirty && (
// 									<Button
// 										variant='destructive'
// 										onClick={() => {
// 											table.resetGlobalFilter(table.initialState.globalFilter)
// 											table.resetColumnFilters(true)
// 										}}>
// 										<Icon name='FunnelX' /> {t('ns_common:actions.clear_filter')}
// 									</Button>
// 								)}
// 								<Button variant='outline' onClick={() => refetch()}>
// 									<Icon name='RotateCw' /> {t('ns_common:actions.reload')}
// 								</Button>
// 							</Div>
// 						</Div>
// 					)
// 				}
// 			}}
// 		/>
// 	)
// }

// export default TruckloadDeliveryTable
