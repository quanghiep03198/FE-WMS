import { IWarehouse } from '@/common/types/entities'
import { i18n } from '@/i18n'
import { warehouses } from '@/mocks/warehouse.data'
import { Meta } from '@storybook/react'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'
import { DataTable } from '..'

const meta = {
	title: 'Components/Datagrid',
	component: DataTable,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
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
		}
	},
	args: { data: [], columns: [], loading: false, enableColumnFilters: true, enableColumnResizing: true }
} satisfies Meta<typeof DataTable>

export default meta

const Template = (props) => {
	const columnHelper = createColumnHelper<IWarehouse>()

	const columns = useMemo(
		() => [
			columnHelper.accessor('warehouse_num', {
				header: 'Warehouse code',
				minSize: 150,
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				cell: ({ getValue }) => String(getValue()).toUpperCase()
			}),
			columnHelper.accessor('warehouse_name', {
				header: 'Warehouse name',
				minSize: 250,
				enableResizing: true,
				enableColumnFilter: true,
				enableSorting: true,
				cell: ({ getValue }) => String(getValue()).toUpperCase()
			}),
			columnHelper.accessor('area', {
				header: 'Area (m²)',
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
	return (
		<I18nextProvider i18n={i18n}>
			<DataTable {...props} data={warehouses} columns={columns} />
		</I18nextProvider>
	)
}

export const SampleDataTable = Template.bind({})