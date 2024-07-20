import { IWarehouse } from '@/common/types/entities'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Icon } from '@/components/ui'
import { EmployeeService } from '@/services/employee.service'
import { WarehouseService } from '@/services/warehouse.service'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Row } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { WAREHOUSE_STORAGE_PROVIDE_TAG } from '../_composables/-use-warehouse-storage-api'

type WarehouseRowActionsProps = {
	row: Row<IWarehouse>
	onEdit: () => void
	onDelete: () => void
}

const WarehouseRowActions: React.FC<WarehouseRowActionsProps> = ({ row, onEdit, onDelete }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	// Prefetch warehouse storage detail before navigating
	const prefetchWarehouseDetail = (warehouseNum: string) =>
		queryClient.prefetchQuery({
			queryKey: [WAREHOUSE_STORAGE_PROVIDE_TAG, warehouseNum],
			queryFn: () => WarehouseService.getWarehouseByNum(warehouseNum)
		})

	// Prefetch employee before opening update form dialog
	const prefetchEmployee = (departmentCode: string, employeeCode: string) =>
		queryClient.prefetchQuery({
			queryKey: ['EMPLOYEE', departmentCode, employeeCode],
			queryFn: () => EmployeeService.searchEmployee({ dept_code: departmentCode, search: employeeCode })
		})

	return (
		<DropdownMenu>
			<DropdownMenuTrigger role='button'>
				<DotsHorizontalIcon />
				<span className='sr-only'>Open menu</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='min-w-40'>
				<DropdownMenuItem
					className='flex items-center gap-x-3'
					onMouseEnter={() => prefetchWarehouseDetail(row.original.warehouse_num)}
					onClick={() =>
						navigate({
							to: '/warehouse/storage-details/$warehouseNum',
							params: { warehouseNum: row.original.warehouse_num }
						})
					}>
					<Icon name='SquareDashedMousePointer' />
					{t('ns_common:actions.detail')}
				</DropdownMenuItem>
				<DropdownMenuItem
					className='flex items-center gap-x-3'
					onMouseEnter={() => prefetchEmployee(row.original.dept_code, row.original?.manager_code)}
					onClick={() => {
						if (typeof onEdit === 'function') onEdit()
					}}>
					<Icon name='Pencil' />
					{t('ns_common:actions.update')}
				</DropdownMenuItem>

				<DropdownMenuItem
					className='flex items-center gap-x-3'
					onClick={() => {
						if (typeof onDelete === 'function') onDelete()
					}}>
					<Icon name='Trash2' />
					{t('ns_common:actions.delete')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default WarehouseRowActions
