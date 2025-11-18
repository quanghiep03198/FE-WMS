import { CommonActions, PresetBreakPoints } from '@/common/constants/enums'
import { useDateLocale } from '@/common/hooks/use-date-locale'
import useMediaQuery from '@/common/hooks/use-media-query'
import { useReactiveRef } from '@/common/hooks/use-reactive-ref'
import formatIntlNumber from '@/common/utils/format-intl-number'
import {
	Badge,
	BadgeProps,
	Button,
	DataTable,
	Div,
	Icon,
	IconProps,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Tooltip,
	Typography
} from '@/components/ui'
import { ROW_ACTIONS_COLUMN_ID, ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { RenderSubComponentProps } from '@/components/ui/@react-table/types'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { createColumnHelper, Table as TanstackTable } from '@tanstack/react-table'
import { format, formatRelative } from 'date-fns'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TruckloadDeliveryStatus } from '../-constants'
import { usePageContext } from '../-contexts/page-context'
import { useGetTruckloadDeliveryQuery } from '../-hooks/use-truckload-delivery-asm'
import GlobalFilterInput from './global-filter-input'
import StatusDropdownMenu from './truckload-delivery-status-filter'

const TruckloadDeliveryTableV2: React.FC = () => {
	const { t, i18n } = useTranslation()
	const isMediumScreen = useMediaQuery(PresetBreakPoints.MEDIUM)
	const tableRef = useReactiveRef<TanstackTable<ITruckloadDelivery>>(null)
	const { data, isLoading, refetch } = useGetTruckloadDeliveryQuery()
	const dateLocale = useDateLocale()
	const { event$ } = usePageContext()

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
				meta: { hidden: isMediumScreen },
				filterFn: 'includesStringSensitive',
				minSize: 150,
				maxSize: 200
			}),

			columnHelper.accessor('container_number', {
				header: t('ns_erp:fields.container_number'),
				enableResizing: true,
				enableSorting: true,
				enableColumnFilter: true,
				filterFn: 'fuzzy',
				minSize: 150,
				maxSize: 200,
				cell: ({ row, getValue }) => {
					const value = getValue()
					if (!value)
						return (
							<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
								<Icon name='Container' />
								{t('ns_common:titles.unknown')}
							</Typography>
						)
					// if (!isMediumScreen) return value
					return (
						<Div className='flex flex-col space-y-0.5'>
							<Typography variant='small' className='font-medium'>
								{row.original.license_plate}
							</Typography>
							<Typography variant='small' color='muted'>
								{row.original.container_number}
							</Typography>
						</Div>
					)
				}
			}),

			columnHelper.accessor('user_code_created', {
				header: 'Created by',
				enableResizing: true,
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: false,
				minSize: 150,
				size: 225,
				maxSize: 250,
				cell: ({ getValue, row }) => (
					<Div className='flex flex-col'>
						<Typography variant='small' className='before:content-["@"]'>
							{getValue()}
						</Typography>
						<Typography variant='small' color='muted' className='line-clamp-1 first-letter:uppercase'>
							{formatRelative(row.original.created, new Date(), { locale: dateLocale }) as string}
						</Typography>
					</Div>
				)
			}),
			columnHelper.accessor('status', {
				header: t('ns_common:common_fields.status'),
				enableResizing: true,
				enableSorting: true,
				enablePinning: true,
				enableColumnFilter: true,
				enableGlobalFilter: false,
				filterFn: 'equals',
				minSize: 150,
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
						[TruckloadDeliveryStatus.REQUEST_CHANGE]: 'UndoDot'
					}

					return (
						<Badge variant={badgeVariants[value] ?? 'secondary'}>
							<Icon name={statusIconVariants[value] ?? 'CircleDotDashed'} />
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
				filterFn: 'inDateRange',
				minSize: 150,
				size: 225,
				maxSize: 250,
				meta: {
					filterVariant: 'date'
				},
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
				header: t('ns_common:common_fields.actions'),
				enableResizing: false,
				enableSorting: false,
				enableGlobalFilter: false,
				enableColumnFilter: false,
				size: 200,
				maxSize: 200,
				meta: { align: 'center' },
				cell: ({ row }) => {
					return (
						<Div className='flex items-center gap-x-0.5'>
							<Button variant='ghost' size='sm'>
								{row.original.status !== TruckloadDeliveryStatus.PENDING
									? t('ns_common:actions.reapprove')
									: t('ns_common:actions.approve')}
							</Button>
							<Button
								variant='ghost'
								size='sm'
								onClick={() =>
									event$.emit({ action: CommonActions.UPDATE, payload: row.original.dispatch_order })
								}>
								{t('ns_common:actions.update')}
							</Button>
							<Button
								variant='ghost'
								size='sm'
								className='text-destructive hover:text-destructive'
								onClick={() =>
									event$.emit({ action: CommonActions.DELETE, payload: row.original.dispatch_order })
								}>
								{t('ns_common:actions.delete')}
							</Button>
						</Div>
					)
				}
			})
		],
		[i18n.language, isMediumScreen]
	)

	// console.log('tableData :>> ', tableData)

	return (
		<DataTable
			ref={tableRef}
			columns={columns}
			data={data}
			loading={isLoading}
			border='bottom-only'
			initialState={{
				pagination: {
					pageIndex: 0,
					pageSize: 50
				},
				columnPinning: {
					left: [],
					right: ['status', ROW_ACTIONS_COLUMN_ID]
				}
			}}
			virtualizerOptions={{
				estimateSize: 80,
				overscan: 10
			}}
			toolbarProps={{
				override: true,
				render: ({ table, event$ }) => {
					const { globalFilter, columnFilters } = table.getState()
					const isFilterDirty = globalFilter?.length !== 0 || columnFilters?.length !== 0

					return (
						<Div className='flex items-center gap-x-1'>
							<GlobalFilterInput {...{ table, event$ }} />
							{/* {!isMediumScreen && <PurchaseOrderFilterInput table={table} />} */}
							<StatusDropdownMenu table={table} />
							<Div className='ml-auto flex items-center justify-end gap-x-1'>
								{isFilterDirty && (
									<Button
										variant='destructive'
										onClick={() => {
											table.resetGlobalFilter(table.initialState.globalFilter)
											table.resetColumnFilters(true)
										}}>
										<Icon name='FunnelX' /> {t('ns_common:actions.clear_filter')}
									</Button>
								)}
								<Button variant='outline' onClick={() => refetch()}>
									<Icon name='RotateCw' /> {t('ns_common:actions.reload')}
								</Button>
							</Div>
						</Div>
					)
				}
			}}
			renderSubComponent={({ row }: RenderSubComponentProps<ITruckloadDelivery>) => (
				<Div className='relative h-80 overflow-scroll rounded-md border'>
					<Table className='w-full table-fixed [&_td]:border-x-0 [&_th]:border-x-0 [&_th]:bg-table-head'>
						<TableHeader className='sticky top-0 z-10'>
							<TableRow>
								<TableHead align='left'>{t('ns_erp:fields.po')}</TableHead>
								<TableHead align='left'>{t('ns_erp:fields.shoestyle_codefactory')}</TableHead>
								<TableHead align='left'>{t('ns_erp:fields.color_sn')}</TableHead>
								<TableHead align='left'>{t('ns_erp:fields.outbound_qty')}</TableHead>
								<TableHead align='right'></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{row.original.delivery_details.map((item) => (
								<TableRow key={item.po}>
									<TableCell align='left'>{item.po}</TableCell>
									<TableCell align='left'>{item.factory_shoes_style}</TableCell>
									<TableCell align='left'>{item.color_sn}</TableCell>
									<TableCell align='left'>{formatIntlNumber(item.outbound_qty)}</TableCell>
									<TableCell align='right'>
										<Button variant='ghost' size='sm'>
											{t('ns_common:actions.update')}
										</Button>
										<Button variant='ghost' size='sm' className='text-destructive hover:text-destructive'>
											{t('ns_common:actions.delete')}
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Div>
			)}
		/>
	)
}

export default TruckloadDeliveryTableV2
