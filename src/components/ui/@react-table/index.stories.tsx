import { i18n } from '@/i18n'
import { faker } from '@faker-js/faker'
import { Meta } from '@storybook/react'
import { AccessorKeyColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'
import { DataTable, Div, Separator, Typography } from '..'

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

interface IUser {
	id: string
	first_name: string
	last_name: string
	email: string
	phone: string
	address: string
	age: number
	job_title: string
	company: string
	department: string
	salary: number
	hire_date: string
	status: 'active' | 'inactive' | 'pending'
}

const users: IUser[] = Array.from(new Array(10_000)).map((_, index) => {
	const person = {
		id: '#' + String(index + 1),
		first_name: faker.person.firstName(),
		last_name: faker.person.lastName(),
		phone: faker.phone.number(),
		address: faker.location.streetAddress(),
		age: faker.number.int({ min: 18, max: 60 }),
		job_title: faker.person.jobTitle(),
		company: faker.company.name(),
		department: faker.commerce.department(),
		salary: faker.number.int({ min: 30000, max: 120000 }),
		hire_date: faker.date.past().toISOString().split('T')[0],
		status: faker.helpers.arrayElement(['active', 'inactive', 'pending'] as const)
	}

	person['email'] = faker.internet.email({
		firstName: person.first_name,
		lastName: person.last_name,
		provider: 'gmail.com'
	})

	return person
})

export const Default = () => {
	const columnHelper = createColumnHelper<IUser>()

	const columns: AccessorKeyColumnDef<IUser>[] = useMemo(
		() => [
			columnHelper.accessor('id', {
				header: '#',
				minSize: 80,
				size: 80,
				enableColumnFilter: false,
				enableResizing: true,
				enableSorting: true
			}),
			columnHelper.accessor('first_name', {
				header: 'First name',
				minSize: 150,
				enableResizing: true,
				enableGlobalFilter: true,
				enableColumnFilter: true,
				enablePinning: true,
				enableSorting: true
			}),
			columnHelper.accessor('last_name', {
				header: 'Last name',
				minSize: 150,
				enableResizing: true,
				enableGlobalFilter: true,
				enableColumnFilter: true,
				enablePinning: true,
				enableSorting: true,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('age', {
				header: 'Age',
				minSize: 150,
				filterFn: 'inNumberRange',
				enableResizing: true,
				enableColumnFilter: true,
				enablePinning: true,
				enableSorting: true
			}),
			columnHelper.accessor('email', {
				header: 'Email',
				minSize: 250,
				enableResizing: true,
				enableGlobalFilter: true,
				enableColumnFilter: true,
				enablePinning: true,
				enableSorting: true,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('address', {
				header: 'Address',
				minSize: 250,
				enableResizing: true,
				enableGlobalFilter: true,
				enableColumnFilter: true,
				enablePinning: true,
				enableSorting: true,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('company', {
				header: 'Company',
				minSize: 250,
				enableResizing: true,
				enableGlobalFilter: true,
				enableColumnFilter: true,
				enablePinning: true,
				enableSorting: true,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('department', {
				header: 'Department',
				minSize: 250,
				enableResizing: true,
				enableGlobalFilter: true,
				enableColumnFilter: true,
				enablePinning: true,
				enableSorting: true,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('job_title', {
				header: 'Job title',
				minSize: 250,
				enableResizing: true,
				enableGlobalFilter: true,
				enableColumnFilter: true,
				enablePinning: true,
				enableSorting: true,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('salary', {
				header: 'Salary',
				minSize: 150,
				enableResizing: true,
				enableColumnFilter: true,
				enablePinning: true,
				enableSorting: true,
				filterFn: 'inNumberRange',
				cell: ({ getValue }) =>
					new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(getValue())
			}),
			columnHelper.accessor('hire_date', {
				header: 'Hire date',
				minSize: 200,
				enableResizing: true,
				enableColumnFilter: true,
				enablePinning: true,
				enableSorting: true,
				meta: {
					filterVariant: 'date'
				},
				cell: ({ getValue }) => new Intl.DateTimeFormat('en-US').format(new Date(getValue()))
			})
		],
		[i18n.language]
	)
	/**
	 * * Ứng dụng đang sử dụng đa ngôn ngữ, I18nextProvider đã được bọc bên ngoài app, nên bạn chỉ cần khai báo component DataTable khi sử dụng.
	 */
	return (
		<I18nextProvider i18n={i18n}>
			<Div className='w-full space-y-6'>
				<Div>
					<Typography variant='h3'>User list</Typography>
					<Typography variant='small' className='text-muted-foreground'>
						This is a sample user list with various fields. You can sort, filter, and resize columns.
					</Typography>
				</Div>
				<Separator />
				<DataTable
					data={users}
					columns={columns}
					enableColumnPinning={true}
					initialState={{
						pagination: {
							pageSize: 500,
							pageIndex: 0
						}
					}}
					containerProps={{ style: { height: window.innerHeight - 300 } }}
				/>
			</Div>
		</I18nextProvider>
	)
}
