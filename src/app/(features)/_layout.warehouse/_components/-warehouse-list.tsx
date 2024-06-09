import { IWarehouse } from '@/common/types/entities'
import { Button, Checkbox, DataTable, DataTableRowActions, Div, Icon, Tooltip, Typography } from '@/components/ui'
import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

const WarehouseList: React.FC = () => {
	const { t } = useTranslation()

	const columnHelper = createColumnHelper<IWarehouse>()

	const columns = [
		columnHelper.accessor('warehouse_num', {
			header: t('ns_warehouse:warehouse_num'),
			cell: ({ getValue }) => <Typography className='text-center'>{String(getValue()).toUpperCase()}</Typography>
		}),
		columnHelper.accessor('warehouse_name', {
			header: t('ns_warehouse:warehouse_name'),
			cell: ({ getValue }) => String(getValue()).toUpperCase()
		}),
		columnHelper.accessor('type_warehouse', {
			header: t('ns_warehouse:type_warehouse'),
			cell: ({ getValue }) => String(getValue()).toUpperCase()
		}),
		columnHelper.accessor('dept_name', {
			header: t('ns_company:department'),
			enableColumnFilter: true
		}),
		columnHelper.accessor('area', {
			header: t('ns_warehouse:area'),
			cell: ({ getValue }) => String(getValue()).toUpperCase()
		}),
		columnHelper.accessor('is_disable', {
			header: t('ns_warehouse:is_disable'),
			cell: ({ getValue }) => <Checkbox defaultChecked={getValue()} />
		}),
		columnHelper.accessor('is_default', {
			header: t('ns_warehouse:is_default'),
			cell: ({ getValue }) => <Checkbox defaultChecked={getValue()} />
		}),

		columnHelper.accessor('remark', {
			header: t('ns_common:common_fields.remark')
		}),
		columnHelper.accessor('id', {
			header: t('ns_warehouse:is_default'),
			cell: ({ getValue }) => <DataTableRowActions />
		})
	]

	return (
		<DataTable
			data={[
				{
					warehouse_num: '0001075',
					warehouse_name: 'Warehouse 1',
					type_warehouse: '成品仓库',
					dept_name: '仓储中心',
					area: 500,
					is_disable: false,
					is_default: true
				}
			]}
			columns={columns}
			enableColumnResizing
			toolbarProps={{
				slot: (
					<>
						<Tooltip content={t('ns_common:actions.add')}>
							<Button variant='outline' size='icon'>
								<Icon name='CirclePlus' />
							</Button>
						</Tooltip>
					</>
				)
			}}
		/>
	)
}

export default WarehouseList
