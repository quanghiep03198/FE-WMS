import { CommonActions, PresetBreakPoints } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import { useReactiveRef } from '@/common/hooks/use-reactive-ref'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Badge, BadgeProps, DataTable, Div, Icon, IconProps, Typography } from '@/components/ui'
import {
	IndeterminateCheckbox,
	RowSelectionCheckbox
} from '@/components/ui/@react-table/components/row-selection-checkbox'
import { ROW_ACTIONS_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { createColumnHelper, Table } from '@tanstack/react-table'
import { format, formatRelative, subHours } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TruckloadDeliveryStatus } from '../-constants'
import { usePageContext } from '../-contexts/page-context'
import GlobalFilterInput from './global-filter-input'
import PurchaseOrderFilterInput from './purchase-order-filter-input'
import RowActionsDropdown from './row-actions-dropdown'
import StatusDropdownMenu from './truckload-delivery-status-filter'

const TruckloadDeliveryTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const columnHelper = createColumnHelper<ITruckloadDelivery>()
	const isMediumScreen = useMediaQuery(PresetBreakPoints.MEDIUM)
	const { event$ } = usePageContext()
	const tableRef = useReactiveRef<Table<ITruckloadDelivery>>(null)

	const columns = useMemo(
		() => [
			columnHelper.accessor('id', {
				id: ROW_SELECTION_COLUMN_ID,
				header: (props) => <IndeterminateCheckbox {...props} />,
				cell: (props) => <RowSelectionCheckbox {...props} />,
				size: 50,
				maxSize: 50,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false,
				enablePinning: false,
				enableGlobalFilter: false,
				enableColumnFilter: false
			}),
			columnHelper.accessor('license_plate', {
				header: t('ns_erp:fields.license_plate'),
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
					if (!isMediumScreen) return getValue()
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
			columnHelper.accessor('po', {
				header: t('ns_erp:fields.po'),
				enableResizing: true,
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: isMediumScreen,
				filterFn: 'fuzzy',
				minSize: 150,
				maxSize: 200,
				cell: ({ row, getValue }) => {
					if (!isMediumScreen) return getValue()
					return (
						<Div className='flex flex-col space-y-0.5'>
							<Typography variant='small' className='font-medium'>
								{row.original.po}
							</Typography>
							<Typography variant='small' color='muted'>
								{formatIntlNumber(row.original.outbound_qty)} (prs)
							</Typography>
						</Div>
					)
				}
			}),
			columnHelper.accessor('outbound_qty', {
				header: t('ns_erp:fields.outbound_qty'),
				enableResizing: true,
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: false,
				minSize: 150,
				maxSize: 200,
				meta: { hidden: isMediumScreen },
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('user_name_created', {
				header: 'Created by',
				enableResizing: true,
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: false,
				minSize: 150,
				maxSize: 200,
				cell: ({ getValue, row }) => (
					<Div className='flex flex-col space-y-0.5'>
						<Typography variant='small'>{getValue()}</Typography>
						<Typography variant='small' color='muted' className='first-letter:!uppercase'>
							{String(row.original.created) as string}
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
					const badgeVariant: BadgeProps['variant'] =
						value === TruckloadDeliveryStatus.CONFIRMED ? 'default' : 'secondary'
					const iconName: IconProps['name'] =
						value === TruckloadDeliveryStatus.CONFIRMED ? 'CircleCheckBig' : 'CircleDotDashed'
					return (
						<Badge variant={badgeVariant}>
							<Icon name={iconName} />
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
				maxSize: 200,
				meta: {
					filterVariant: 'date'
				},
				cell: ({ getValue }) => format(new Date(getValue()), 'yyyy-MM-dd HH:mm')
			}),
			columnHelper.display({
				id: ROW_ACTIONS_COLUMN_ID,
				header: '-',
				enableResizing: false,
				enableSorting: false,
				enableGlobalFilter: false,
				enableColumnFilter: false,
				size: 60,
				maxSize: 60,
				meta: { align: 'center' },
				cell: ({ row }) => {
					return <RowActionsDropdown data={row.original} />
				}
			})
		],
		[i18n.language, isMediumScreen]
	)

	useEffect(() => {
		event$.emit({
			action: CommonActions.DELETE,
			payload: tableRef.current?.getFilteredSelectedRowModel().flatRows.map((row) => row.original.id)
		})
	}, [tableRef.current?.getState()?.rowSelection])

	return (
		<DataTable
			columns={columns}
			ref={tableRef}
			data={[
				{
					id: 1,
					license_plate: '15B3-59014',
					container_number: '31109332',
					po: '100384872',
					created: formatRelative(subHours(new Date(), 6), new Date()),
					factory_departure_time: null,
					outbound_qty: 2500,
					user_name_created: 'Admin',
					status: TruckloadDeliveryStatus.PENDING
				},
				{
					id: 2,
					license_plate: '15B3-43002',
					container_number: '11109333',
					po: '500384872',
					created: formatRelative(subHours(new Date(), 6), new Date()),
					factory_departure_time: new Date(),
					outbound_qty: 4200,
					user_name_created: 'Admin',
					status: TruckloadDeliveryStatus.CONFIRMED
				}
			]}
			border='bottom-only'
			initialState={{
				pagination: {
					pageIndex: 0,
					pageSize: 50
				},
				columnPinning: {
					left: [ROW_SELECTION_COLUMN_ID],
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
					return (
						<Div className='flex items-center gap-x-1'>
							<GlobalFilterInput {...{ table, event$ }} />
							{!isMediumScreen && <PurchaseOrderFilterInput table={table} />}
							<StatusDropdownMenu table={table} />
						</Div>
					)
				}
			}}
		/>
	)
}

export default TruckloadDeliveryTable
