import { PresetBreakPoints } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import formatIntlNumber from '@/common/utils/format-intl-number'
import {
	buttonVariants,
	DataTable,
	Div,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuTrigger,
	Icon,
	Typography
} from '@/components/ui'
import { DebouncedInput } from '@/components/ui/@react-table/components/debounced-input'
import {
	IndeterminateCheckbox,
	RowSelectionCheckbox
} from '@/components/ui/@react-table/components/row-selection-checkbox'
import { ROW_ACTIONS_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { pick } from 'lodash'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import RowActionsDropdown from './row-actions-dropdown'

const TruckloadDeliveryMasterTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const columnHelper = createColumnHelper<ITruckloadDelivery>()
	const isMediumScreen = useMediaQuery(PresetBreakPoints.MEDIUM)

	const columns = useMemo(
		() => [
			columnHelper.accessor('id', {
				id: ROW_SELECTION_COLUMN_ID,
				header: (props) => (
					<IndeterminateCheckbox
						{...props}
						onCheckedChange={(checked) => {
							// if (checked) setRowSelectionType('multiple')
						}}
					/>
				),
				cell: (props) => (
					<RowSelectionCheckbox
						{...props}
						onCheckedChange={(checked) => {
							// if (checked) setRowSelectionType('multiple')
						}}
					/>
				),
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
							<Typography className='font-medium'>{row.original.license_plate}</Typography>
							<Typography color='muted'>{row.original.container_number}</Typography>
						</Div>
					)
				}
			}),
			columnHelper.accessor('po', {
				header: t('ns_erp:fields.po'),
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
							<Typography className='font-medium'>{row.original.po}</Typography>
							<Typography color='muted'>{formatIntlNumber(row.original.outbound_qty)} (prs)</Typography>
						</Div>
					)
				}
			}),
			columnHelper.accessor('outbound_qty', {
				header: t('ns_erp:fields.outbound_qty'),
				enableResizing: true,
				enableSorting: true,
				enableColumnFilter: true,
				filterFn: 'inNumberRange',
				meta: { filterVariant: 'range', hidden: isMediumScreen },
				minSize: 150,
				maxSize: 200
			}),
			columnHelper.accessor('factory_departure_time', {
				header: t('ns_erp:fields.factory_departure_time'),
				enableResizing: true,
				enableSorting: true,
				enableColumnFilter: true,
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
				enableColumnFilter: false,
				size: 60,
				maxSize: 60,
				cell: ({ row }) => {
					return <RowActionsDropdown data={row.original} />
				}
			})
		],
		[i18n.language, isMediumScreen]
	)

	return (
		<DataTable
			columns={columns}
			data={[
				{
					id: 1,
					license_plate: '15B3-59014',
					container_number: '2212A3SC',
					po: '100384872',
					factory_departure_time: new Date(),
					outbound_qty: 2500
				}
			]}
			border='bottom-only'
			virtualizerOptions={{
				estimateSize: 80,
				overscan: 10
			}}
			toolbarProps={{
				override: true,
				render: ({ table, event$ }) => {
					return (
						<Div className='flex items-center justify-between'>
							<Div className='flex items-center gap-x-1'>
								<Div className='flex h-8 items-center gap-x-1 rounded-md border px-3 shadow-sm'>
									<Icon name='Search' />
									<DebouncedInput
										value={table.getState().globalFilter}
										onChange={(value) => {
											event$.emit(pick(table.getState(), ['rowSelection']))
											table.setGlobalFilter(String(value))
										}}
										className='h-full p-0 pl-2 shadow-none'
										placeholder={t('ns_common:actions.search') + ' ...'}
										type='search'
									/>
								</Div>
								<DropdownMenu>
									<DropdownMenuTrigger
										className={cn(
											buttonVariants({ variant: 'outline', size: 'sm', className: 'border-dashed' })
										)}>
										<Icon name='CirclePlus' /> Status
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuRadioGroup></DropdownMenuRadioGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							</Div>
						</Div>
					)
				}
			}}
		/>
	)
}

export default TruckloadDeliveryMasterTable
