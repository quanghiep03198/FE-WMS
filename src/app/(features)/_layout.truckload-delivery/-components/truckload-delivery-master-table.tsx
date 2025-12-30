import useMediaQuery from '@/common/hooks/use-media-query'
import { useReactiveRef } from '@/common/hooks/use-reactive-ref'
import { cn } from '@/common/utils/cn'
import formatIntlNumber from '@/common/utils/format-intl-number'
import {
	Badge,
	Checkbox,
	DataTable,
	Div,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	IconProps,
	Tooltip,
	Typography
} from '@/components/ui'
import { ROW_ACTIONS_COLUMN_ID, ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { createColumnHelper, Table } from '@tanstack/react-table'
import { useResetState } from 'ahooks'
import { format } from 'date-fns'
import { pick } from 'lodash-es'
import { useLayoutEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { url } from 'zod'
import { TruckloadDeliveryStatus } from '../-constants'
import { useGetTruckloadDeliveryQuery, useUpdateContainerConditionMutation } from '../-hooks/use-truckload-delivery-asm'
import { GhostButton } from '../../-components/shared/ghost-button'
import RowActions from './row-actions'
import TruckloadDeliveryDetailTable from './truckload-delivery-detail-table'
import TruckloadDeliveryTableToolbar from './truckload-delivery-table-toolbar'

const TruckloadDeliveryMasterTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const isMobile = useMediaQuery('(max-width: 1023px)')
	const tableRef = useReactiveRef<Table<ITruckloadDelivery>>(null)
	const { data, isLoading } = useGetTruckloadDeliveryQuery()
	const { mutateAsync } = useUpdateContainerConditionMutation()
	const columnHelper = createColumnHelper<ITruckloadDelivery>()
	const [expanded, setExpanded, resetExpanded] = useResetState<{ [key: string]: boolean }>({})

	const columns = useMemo(
		() => [
			columnHelper.display({
				id: ROW_EXPANSION_COLUMN_ID,
				header: () => (
					<Tooltip message={t('ns_common:actions.fold')} triggerProps={{ asChild: true }}>
						<GhostButton className='absolute inset-0' onClick={() => resetExpanded()}>
							<Icon name='ListCollapse' size={18} />
						</GhostButton>
					</Tooltip>
				),
				size: 40,
				maxSize: 50,
				enableHiding: false,
				enableResizing: false,
				enableSorting: false,
				enableGlobalFilter: false,
				enableColumnFilter: false,
				cell: ({ row }) => (
					<GhostButton
						className='absolute inset-0'
						disabled={false}
						onClick={() => {
							setExpanded({ [row.original.dispatch_order]: !row.getIsExpanded() })
						}}>
						<Icon name={row.getIsExpanded() ? 'ChevronDown' : 'ChevronRight'} />
					</GhostButton>
				)
			}),
			columnHelper.accessor('dispatch_order', {
				sortDescFirst: true,
				enableSorting: true,
				enableMultiSort: true
			}),
			columnHelper.accessor('purchase_orders', {
				filterFn: 'arrIncludes'
			}),
			columnHelper.accessor('license_plate', {
				header: !isMobile
					? t('ns_erp:fields.license_plate')
					: t('ns_erp:fields.license_plate') + ' / ' + t('ns_erp:fields.container_number'),
				enableResizing: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				enableGlobalFilter: true,
				cell: ({ row, getValue }) => {
					const value = getValue()
					if (!value)
						return (
							<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
								<Icon name='Truck' className='self-center stroke-muted-foreground' />
								{t('ns_common:titles.unknown')}
							</Typography>
						)
					if (!isMobile)
						return (
							<LicensePlateHoverCard
								licensePlate={row.original.license_plate}
								licensePlateImage={row.original.license_plate_image}
							/>
						)
					return (
						<Div className='flex flex-col'>
							<LicensePlateHoverCard
								licensePlate={row.original.license_plate}
								licensePlateImage={row.original.license_plate_image}
							/>
							<Typography
								variant='small'
								color='muted'
								className='col-start-2 inline-grid grid-cols-[auto_1fr] gap-x-2 font-normal'>
								{row.original.container_number}
							</Typography>
						</Div>
					)
				}
			}),
			columnHelper.accessor('container_number', {
				header: t('ns_erp:fields.container_number'),
				enableResizing: true,
				enableSorting: true,
				enableGlobalFilter: true,
				filterFn: 'fuzzy',
				minSize: 150,
				size: 150,
				maxSize: 250,
				cell: ({ getValue }) => {
					const value = getValue()
					if (!value)
						return (
							<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
								<Icon name='Container' />
								{t('ns_common:titles.unknown')}
							</Typography>
						)

					return value
				}
			}),
			columnHelper.accessor('total_outbound_qty', {
				header: t('ns_erp:fields.outbound_qty'),
				enableSorting: true,
				meta: { align: 'right' },
				cell: ({ getValue }) => formatIntlNumber(getValue() as number)
			}),
			columnHelper.accessor('punctured_container', {
				header: t('ns_erp:fields.punctured_container'),
				enableSorting: true,
				cell: ({ getValue, row }) => {
					return (
						<Checkbox
							disabled={row.original.approval_status === TruckloadDeliveryStatus.CONFIRMED}
							defaultChecked={Boolean(getValue())}
							checked={Boolean(getValue())}
							onCheckedChange={async (value) =>
								await mutateAsync({
									dispatch_order: row.original.dispatch_order,
									punctured_container: Boolean(value)
								})
							}
						/>
					)
				}
			}),
			columnHelper.accessor('smelling_container', {
				header: t('ns_erp:fields.smelling_container'),
				enableSorting: true,
				cell: ({ getValue, row }) => {
					return (
						<Checkbox
							disabled={row.original.approval_status === TruckloadDeliveryStatus.CONFIRMED}
							defaultChecked={Boolean(getValue())}
							checked={Boolean(getValue())}
							onCheckedChange={async (value) =>
								await mutateAsync({
									dispatch_order: row.original.dispatch_order,
									smelling_container: Boolean(value)
								})
							}
						/>
					)
				}
			}),
			columnHelper.accessor('moist_container', {
				header: t('ns_erp:fields.moist_container'),
				enableSorting: true,
				cell: ({ getValue, row }) => {
					return (
						<Checkbox
							disabled={row.original.approval_status === TruckloadDeliveryStatus.CONFIRMED}
							defaultChecked={Boolean(getValue())}
							checked={Boolean(getValue())}
							onCheckedChange={async (value) =>
								await mutateAsync({
									dispatch_order: row.original.dispatch_order,
									moist_container: Boolean(value)
								})
							}
						/>
					)
				}
			}),
			columnHelper.accessor('approval_status', {
				header: t('ns_erp:fields.status_approve'),
				enableResizing: true,
				enableSorting: true,
				enablePinning: true,
				enableColumnFilter: true,
				enableGlobalFilter: false,
				filterFn: 'equals',
				minSize: 150,
				size: 180,
				maxSize: 200,
				cell: ({ getValue }) => {
					const value = getValue() as TruckloadDeliveryStatus

					const statusIconVariants: Record<TruckloadDeliveryStatus, IconProps['name']> = {
						[TruckloadDeliveryStatus.PENDING]: 'Loader',
						[TruckloadDeliveryStatus.CONFIRMED]: 'CircleCheckBig',
						[TruckloadDeliveryStatus.REQUEST_CHANGE]: 'Undo2'
					}

					return (
						<Badge variant='outline' className='rounded-l-full rounded-r-full'>
							<Icon
								name={statusIconVariants[value] ?? 'CircleDotDashed'}
								size={14}
								className={cn({
									'stroke-muted-foreground': value === TruckloadDeliveryStatus.PENDING,
									'stroke-success': value === TruckloadDeliveryStatus.CONFIRMED,
									'stroke-destructive': value === TruckloadDeliveryStatus.REQUEST_CHANGE
								})}
							/>
							{t(`ns_common:status.${value}`)}
						</Badge>
					)
				}
			}),
			columnHelper.accessor('created_at', {
				header: t('ns_common:common_fields.created_at'),
				enableResizing: true,
				enableSorting: true,
				enableColumnFilter: false,
				enableGlobalFilter: false,
				minSize: 150,
				size: 200,
				maxSize: 250,
				sortingFn: 'auto',
				cell: ({ getValue }) => {
					const createdAt = getValue()
					return createdAt ? (
						format(new Date(createdAt), 'yyyy-MM-dd HH:mm')
					) : (
						<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
							<Icon name='ClockAlert' stroke='hsl(var(--muted-foreground))' />
							{t('ns_common:titles.unknown')}
						</Typography>
					)
				}
			}),
			columnHelper.accessor('container_sealing_time', {
				header: t('ns_erp:fields.container_sealing_time'),
				enableResizing: true,
				enableSorting: true,
				enableColumnFilter: false,
				enableGlobalFilter: false,
				minSize: 150,
				size: 200,
				maxSize: 250,
				sortingFn: 'auto',
				cell: ({ getValue }) => {
					const containerSealingTime = getValue()
					return containerSealingTime ? (
						format(new Date(containerSealingTime), 'yyyy-MM-dd HH:mm')
					) : (
						<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
							<Icon name='ClockAlert' stroke='hsl(var(--muted-foreground))' />
							{t('ns_common:titles.unknown')}
						</Typography>
					)
				}
			}),
			columnHelper.accessor('factory_departure_time', {
				header: t('ns_erp:fields.factory_departure_time'),
				enableResizing: true,
				enableSorting: true,
				enableColumnFilter: false,
				enableGlobalFilter: false,
				minSize: 150,
				size: 200,
				maxSize: 250,
				sortingFn: 'auto',
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
			columnHelper.accessor('actual_factory_departure_time', {
				header: t('ns_erp:fields.actual_factory_departure_time'),
				enableResizing: true,
				enableSorting: true,
				enableColumnFilter: false,
				enableGlobalFilter: false,
				minSize: 150,
				size: 200,
				maxSize: 250,
				sortingFn: 'auto',
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
				size: 60,
				maxSize: 60,
				meta: { align: 'center' },
				cell: ({ row }) => {
					return (
						<RowActions
							data={pick(row.original, [
								'dispatch_order',
								'license_plate',
								'container_number',
								'approval_status',
								'punctured_container',
								'smelling_container',
								'moist_container'
							])}
						/>
					)
				}
			})
		],
		[i18n.language, isMobile, tableRef]
	)

	useLayoutEffect(() => {
		if (tableRef.current) {
			tableRef.current.setColumnVisibility({
				...tableRef.current.getState().columnVisibility,
				dispatch_order: false,
				purchase_orders: false,
				container_number: !isMobile,
				total_outbound_qty: !isMobile,
				container_sealing_time: !isMobile,
				factory_departure_time: !isMobile,
				punctured_container: !isMobile,
				smelling_container: !isMobile,
				moist_container: !isMobile
			})
			tableRef.current.setColumnPinning({
				left: [ROW_EXPANSION_COLUMN_ID, ...(isMobile ? ['licence_plate'] : [])],
				right: [ROW_ACTIONS_COLUMN_ID]
			})
		}
	}, [tableRef.current, isMobile])

	return (
		<DataTable
			ref={tableRef}
			columns={columns}
			data={data}
			border='bottom-only'
			loading={isLoading}
			expanded={expanded}
			enableColumnFilters={true}
			enableGlobalFilter={true}
			enableExpanding={true}
			getRowCanExpand={() => true}
			getColumnCanGlobalFilter={() => true}
			getRowId={(originalRow: ITruckloadDelivery) => originalRow.dispatch_order}
			enableMultiSort={true}
			manualExpanding={true}
			globalFilterFn='includesString'
			initialState={{
				sorting: [{ id: 'dispatch_order', desc: true }],
				pagination: {
					pageIndex: 0,
					pageSize: 50
				},
				columnVisibility: {
					dispatch_order: false,
					purchase_orders: false,
					container_number: !isMobile,
					total_outbound_qty: !isMobile,
					container_sealing_time: !isMobile,
					factory_departure_time: !isMobile,
					punctured_container: !isMobile,
					smelling_container: !isMobile,
					moist_container: !isMobile
				},
				columnPinning: {
					left: [ROW_EXPANSION_COLUMN_ID],
					right: [...(isMobile ? ['container_number'] : []), ROW_ACTIONS_COLUMN_ID]
				}
			}}
			virtualizerOptions={{
				estimateSize: isMobile ? 60 : 40,
				overscan: 10
			}}
			toolbarProps={{
				override: true,
				render: (props) => <TruckloadDeliveryTableToolbar {...props} />
			}}
			containerProps={{
				className: 'h-[65vh] md:h-[55vh]'
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

const LicensePlateHoverCard: React.FC<{ licensePlate: string; licensePlateImage: string | null }> = ({
	licensePlate,
	licensePlateImage
}) => {
	const disabled = !url().safeParse(licensePlateImage).success
	const isMobile = useMediaQuery('(max-width: 1023px)')

	return (
		<HoverCard openDelay={0} closeDelay={0}>
			<HoverCardTrigger
				className={cn(
					'inline-grid cursor-default grid-cols-[auto_1fr] items-center gap-x-2 !p-0',
					isMobile ? 'font-medium' : 'font-normal',
					disabled ? 'hover:no-underline' : 'hover:underline hover:underline-offset-2'
				)}>
				<Icon name='Container' />
				{licensePlate}
			</HoverCardTrigger>
			<HoverCardContent hidden={disabled} className='max-w-60' align='start'>
				<img
					loading='lazy'
					src={licensePlateImage}
					className='aspect-video max-w-full rounded-[inherit] object-cover object-center'
				/>
			</HoverCardContent>
		</HoverCard>
	)
}

export default TruckloadDeliveryMasterTable
