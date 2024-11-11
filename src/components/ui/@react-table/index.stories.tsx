import { warehouseTypes } from '@/app/(features)/_layout.warehouse/_constants/warehouse.const'
import { IWarehouse } from '@/common/types/entities'
import { warehouses } from '@/components/ui/@react-table/mocks'
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
	},
	// * This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// * More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		data: { name: 'data', description: 'Dữ liệu hiển thị trên table' },
		columns: { name: 'columns', description: 'Các cột đã được định nghĩa' },
		loading: { name: 'loading', description: 'Trạng thái loading dữ liệu khi dùng với API' },
		enableColumnFilters: { description: 'Cho phép tìm kiếm dữ liệu theo các cột', defaultValue: false },
		enableColumnResizing: { description: 'Cho phép tùy chỉnh độ rộng các cột', defaultValue: false },
		enableSorting: { description: 'Cho phép sort dữ liệu trên bảng' },
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

export function SampleDataTable() {
	const columnHelper = createColumnHelper<IWarehouse>()

	const data = warehouses.map((item) => ({
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
