import { WarehouseTypes } from '@/app/(features)/_layout.warehouse/_constants/warehouse.enum'
import { IWarehouse } from '@/common/types/entities'
import { i18n } from '@/i18n'
import { Meta } from '@storybook/react'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { DataTable } from '..'

export default {
	title: 'Components/Datagrid',
	component: DataTable,
	parameters: {
		// * Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		backgrounds: {
			options: {}
		}
	},
	// * This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// * More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		data: { name: 'data', description: 'Dữ liệu hiển thị trên table' },
		columns: { name: 'columns', description: 'Các cột đã được định nghĩa' },
		loading: {
			name: 'loading',
			description: 'Trạng thái loading dữ liệu khi dùng với API',
			control: 'boolean',
			defaultValue: false
		},
		enableColumnFilters: {
			description: 'Cho phép tìm kiếm dữ liệu theo các cột',
			control: 'boolean',
			defaultValue: false
		},
		enableColumnResizing: {
			description: 'Cho phép tùy chỉnh độ rộng các cột',
			control: 'boolean',
			defaultValue: true
		},
		enableSorting: { description: 'Cho phép sort dữ liệu trên bảng', control: 'boolean', defaultValue: true },
		renderSubComponent: { description: 'Render sub-row component' },
		manualPagination: {
			description: 'Xác định sử dụng phân trang mặc định hay không',
			control: 'boolean',
			defaultValue: true
		},
		paginationProps: {
			description: 'State phân trang thủ công, thường sử dụng với server side pagination.',
			defaultValue: undefined
		},
		toolbarProps: {
			description: 'Các nút chức năng trên table',
			defaultValue: undefined
		}
	}
} satisfies Meta<typeof DataTable>

export const Default = () => {
	const warehouseTypes = Object.values(WarehouseTypes)

	const warehouses: IWarehouse[] = Array.from(new Array(10)).map((_, index) => ({
		id: String(index + 1),
		warehouse_name: 'Warehouse ' + String(index + 1),
		type_warehouse: warehouseTypes[Math.floor(Math.random() * warehouseTypes.length)] as any,
		warehouse_num: 'VA1PW' + String(index + 1),
		dept_code: 'VA1PW01',
		area: Math.round(Math.random() * 5000),
		is_disable: false,
		is_default: false,
		employee_code: null,
		employee_name: null,
		company_code: 'VA1',
		dept_name: null,
		remark: null
	}))

	const columnHelper = createColumnHelper<IWarehouse>()

	const data = warehouses?.map((item) => ({
		...item,
		is_default: Boolean(item.is_default),
		is_disable: Boolean(item.is_disable),
		type_warehouse: i18n.t(warehouseTypes[item.type_warehouse], {
			ns: 'ns_warehouse',
			defaultValue: item.type_warehouse
		})
	}))

	const columns = useMemo(
		() => [
			columnHelper.accessor('warehouse_num', {
				header: i18n.t('ns_warehouse:fields.warehouse_num'),
				minSize: 150,
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				cell: ({ getValue }) => String(getValue()).toUpperCase()
			}),
			columnHelper.accessor('warehouse_name', {
				header: i18n.t('ns_warehouse:fields.warehouse_name'),
				minSize: 250,
				enableResizing: true,
				enableColumnFilter: true,
				enableSorting: true,
				cell: ({ getValue }) => String(getValue()).toUpperCase()
			}),
			columnHelper.accessor('type_warehouse', {
				header: i18n.t('ns_warehouse:fields.type_warehouse'),
				minSize: 250,
				enableResizing: true,
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'equals',
				meta: {
					filterVariant: 'select',
					facetedUniqueValues: Object.entries(warehouseTypes).map(([key, val]) => ({
						label: i18n.t(val, { ns: 'ns_warehouse', defaultValue: val }),
						value: key
					}))
				}
			}),
			columnHelper.accessor('area', {
				header: i18n.t('ns_warehouse:fields.area'),
				minSize: 150,
				filterFn: 'inNumberRange',
				enableColumnFilter: true,
				enableGlobalFilter: false,
				enableResizing: true,
				enableSorting: true,
				cell: ({ getValue }) => new Intl.NumberFormat('en-US', { minimumSignificantDigits: 3 }).format(getValue())
			}),
			columnHelper.accessor('remark', {
				header: 'Remark',
				enableResizing: true
			})
		],
		[]
	)
	/**
	 * * Ứng dụng đang sử dụng đa ngôn ngữ, I18nextProvider đã được bọc bên ngoài app, nên bạn chỉ cần khai báo component DataTable khi sử dụng.
	 */
	return <DataTable data={data} columns={columns} />
}
