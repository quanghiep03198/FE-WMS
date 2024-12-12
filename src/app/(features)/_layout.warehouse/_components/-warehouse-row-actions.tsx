import { IWarehouse } from '@/common/types/entities'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Icon } from '@/components/ui'
import { EmployeeService } from '@/services/employee.service'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Row } from '@tanstack/react-table'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getWarehouseStorageOptions } from '../_apis/warehouse-storage.api'

type WarehouseRowActionsProps = {
	row: Row<IWarehouse>
	onEdit: () => void
	onDelete: () => void
}

const WarehouseRowActions: React.FC<WarehouseRowActionsProps> = ({ row, onEdit, onDelete }) => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)
	// Prefetch warehouse storage detail before navigating
	const prefetchWarehouseDetail = async (warehouseNum: string) => {
		await queryClient.prefetchQuery(getWarehouseStorageOptions(warehouseNum))
	}

	// Prefetch employee before opening update form dialog
	const prefetchEmployee = (departmentCode: string, employeeCode: string) =>
		queryClient.prefetchQuery({
			queryKey: ['EMPLOYEE', departmentCode, employeeCode],
			queryFn: () => EmployeeService.searchEmployee({ dept_code: departmentCode, search: employeeCode })
		})

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger>
				<DotsHorizontalIcon />
				<span className='sr-only'>Open menu</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='min-w-40'>
				<DropdownMenuItem asChild={true} className='flex items-center gap-x-3'>
					<Link
						preload='render'
						to='/warehouse/storage-details/$warehouseNum'
						params={
							{ warehouseNum: row.original.warehouse_num } as unknown as React.ComponentProps<
								typeof Link
							>['params']
						}
						onMouseEnter={() => prefetchWarehouseDetail(row.original.warehouse_num)}>
						<Icon name='SquareDashedMousePointer' />
						{t('ns_common:actions.detail')}
					</Link>
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

export default memo(WarehouseRowActions)
