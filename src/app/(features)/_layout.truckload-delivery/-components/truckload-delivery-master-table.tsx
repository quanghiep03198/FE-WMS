import RoleBaseAccessControl from '@/app/-components/-guard/role-base-access-control'
import { UserRole } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import { useReactiveRef } from '@/common/hooks/use-reactive-ref'
import { cn } from '@/common/utils/cn'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Badge, Checkbox, DataTable, Div, Icon, IconProps, Tooltip, Typography } from '@/components/ui'
import TableCellText from '@/components/ui/@react-table/components/table-cell-text'
import { ROW_ACTIONS_COLUMN_ID, ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { RenderSubComponentProps } from '@/components/ui/@react-table/types'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { type ColumnDefBase, createColumnHelper, type Table } from '@tanstack/react-table'
import { useResetState } from 'ahooks'
import { format } from 'date-fns'
import { useCallback, useLayoutEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TruckloadDeliveryStatus } from '../-constants'
import { useGetTruckloadDeliveryQuery, useUpdateContainerConditionMutation } from '../-hooks/use-truckload-delivery-asm'
import { GhostButton } from '../../-components/shared/ghost-button'
import LicensePlateHoverCard from './license-plate-hover-card'
import RowActions from './row-actions'
import TruckloadDeliveryDetailTable from './truckload-delivery-detail-table'
import TruckloadDeliveryTableToolbar from './truckload-delivery-table-toolbar'

const TruckloadDeliveryMasterTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const isMobile = useMediaQuery('(max-width: 1023px)')
	const tableRef = useReactiveRef<Table<ITruckloadDelivery>>(null)
	const { data, isLoading } = useGetTruckloadDeliveryQuery()
	const columnHelper = createColumnHelper<ITruckloadDelivery>()
	const [expanded, setExpanded, resetExpanded] = useResetState<{ [key: string]: boolean }>({})

	const licensePlateColumnHeader = !isMobile
		? t('ns_erp:fields.license_plate')
		: t('ns_erp:fields.license_plate') + ' / ' + t('ns_erp:fields.container_number')

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
				size: 50,
				maxSize: 50,
				enableHiding: false,
				enableResizing: false,
				enableSorting: false,
				enableGlobalFilter: false,
				enableColumnFilter: false,
				meta: { align: 'center' },
				cell: ({ row }) => (
					<GhostButton
						className='absolute inset-0'
						disabled={false}
						onClick={() => setExpanded({ [row.original.dispatch_order]: !row.getIsExpanded() })}>
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
				header: licensePlateColumnHeader,
				enableResizing: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				enableGlobalFilter: true,
				cell: LicensePlateColumnCell
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
				cell: TableCellText
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
				meta: { align: 'center' },
				cell: ContainerStatusCheckbox
			}),
			columnHelper.accessor('smelling_container', {
				header: t('ns_erp:fields.smelling_container'),
				enableSorting: true,
				meta: { align: 'center' },
				cell: ContainerStatusCheckbox
			}),
			columnHelper.accessor('moist_container', {
				header: t('ns_erp:fields.moist_container'),
				enableSorting: true,
				meta: { align: 'center' },
				cell: ContainerStatusCheckbox
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
				cell: DispatchOrderStatusBadge
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
				cell: DateTimeCell
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
				cell: DateTimeCell
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
				cell: DateTimeCell
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
				cell: DateTimeCell
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
				cell: RowActions
			})
		],
		[i18n.language, isMobile]
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

	const renderSubTable = useCallback(({ row }: RenderSubComponentProps<ITruckloadDelivery>) => {
		const data = row.original
		return <TruckloadDeliveryDetailTable data={data} onCollapse={resetExpanded} />
	}, [])

	return (
		<DataTable
			ref={tableRef}
			columns={columns}
			data={data}
			border='bottom-only'
			loading={isLoading}
			expanded={expanded}
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
				overscan: 10,
				enabled: false
			}}
			toolbarProps={{
				override: true,
				render: (props) => <TruckloadDeliveryTableToolbar {...props} />
			}}
			containerProps={{
				style: { height: 'calc(var(--outlet-wrapper-height) - 14rem)' },
				className:
					'md:[&_tr[data-role=expandable-row]_*]:animate-none md:[&_tr[data-role=expandable-row]_*]:transition-none'
			}}
			renderSubComponent={renderSubTable}
		/>
	)
}

const DispatchOrderStatusBadge: ColumnDefBase<ITruckloadDelivery, TruckloadDeliveryStatus>['cell'] = ({ getValue }) => {
	const { t } = useTranslation()

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

const LicensePlateColumnCell: ColumnDefBase<ITruckloadDelivery, string>['cell'] = ({ row, getValue }) => {
	const { t } = useTranslation()
	const isMobile = useMediaQuery('(max-width: 1023px)')

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

const ContainerStatusCheckbox: ColumnDefBase<ITruckloadDelivery, boolean>['cell'] = ({ row, column, getValue }) => {
	const { mutateAsync, isPending, isError, variables } = useUpdateContainerConditionMutation()
	const currentValue = isPending ? variables[column.id] : Boolean(getValue())

	return (
		<RoleBaseAccessControl
			mode='mask'
			classNames={{
				innerWrapper: 'grid place-items-center group-hover/rbac:opacity-0'
			}}
			authorizedRoles={[UserRole.FG_WAREHOUSE_STAFF]}>
			<Checkbox
				className={cn(isPending ? 'opacity-50' : 'opacity-100', isError ? 'border-destructive' : 'border-primary')}
				disabled={row.original.approval_status === TruckloadDeliveryStatus.CONFIRMED || isPending}
				defaultChecked={currentValue}
				checked={currentValue}
				onCheckedChange={async (value) =>
					await mutateAsync({
						dispatch_order: row.original.dispatch_order,
						[column.id]: Boolean(value)
					})
				}
			/>
		</RoleBaseAccessControl>
	)
}

const DateTimeCell: ColumnDefBase<ITruckloadDelivery, Date>['cell'] = ({ getValue }) => {
	const { t } = useTranslation()
	const value = getValue()
	if (value) return format(new Date(value), 'yyyy-MM-dd HH:mm')
	return (
		<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
			<Icon name='ClockAlert' stroke='hsl(var(--muted-foreground))' />
			{t('ns_common:titles.unknown')}
		</Typography>
	)
}

export default TruckloadDeliveryMasterTable
