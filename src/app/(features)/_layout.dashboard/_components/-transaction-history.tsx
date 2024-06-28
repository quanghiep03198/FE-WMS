import { Badge, DataTable, Div, Icon, Typography, buttonVariants } from '@/components/ui'
import { recentExports, transactionOverview } from '@/mocks/dashboard.data'
import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts'

const TransactionHistory: React.FC = () => {
	const columnHelper = createColumnHelper<any>()
	const columns = useMemo(
		() => [
			columnHelper.accessor('status', {
				header: 'Status',
				cell: ({ getValue }) => {
					const value = getValue()
					const variant = (() => {
						switch (value) {
							case 'Pending':
								return 'secondary'
							case 'Completed':
								return 'primary'
							case 'Canceled':
								return 'destructive'
							default:
								return 'outline'
						}
					})() as React.ComponentProps<typeof Badge>['variant']
					return <Badge variant={variant}>{getValue()}</Badge>
				}
			}),
			columnHelper.accessor('sale_representator', {
				header: 'Sale Representative',
				enableSorting: true,
				size: 180,
				cell: ({ getValue }) => {
					const value = getValue()
					return (
						<Typography variant='p' className='font-medium'>
							{value.name}
						</Typography>
					)
				}
			}),
			columnHelper.accessor('company_name', {
				header: 'Company Name',
				enableSorting: true,
				size: 200
			}),
			columnHelper.accessor('amount', {
				header: 'Amount',
				enableSorting: true,
				size: 200
			})
		],
		[]
	)

	return (
		<Div className='grid grid-cols-3 items-stretch gap-x-10 gap-y-6 md:grid-cols-1'>
			<Div className='col-span-2'>
				<Div className='mb-2 flex flex-row items-center justify-between'>
					<Typography className='text-sm font-medium'>Transaction History</Typography>
					<Link className={buttonVariants({ variant: 'link', className: 'gap-x-2' })}>
						View all <Icon name='ArrowRight' />
					</Link>
				</Div>
				<Div>
					<DataTable
						data={recentExports}
						columns={columns}
						paginationProps={{ hidden: true }}
						toolbarProps={{ hidden: true }}
						enableColumnResizing={true}
						containerProps={{ style: { height: screen.availHeight / 2.95 } }}
					/>
				</Div>
			</Div>

			<Div className='col-span-1 flex flex-col items-center justify-center space-y-6'>
				<Typography className='text-center font-medium'>Transaction Status Overview</Typography>
				<PieChart width={320} height={240}>
					<Pie
						data={transactionOverview}
						innerRadius={48}
						outerRadius={96}
						fill='hsl(var(--primary))'
						stroke='hsl(var(--border))'
						paddingAngle={2}
						dataKey='value'>
						{transactionOverview.map((item) => (
							<Cell key={item.name} fill={item.color} />
						))}
					</Pie>
					<Tooltip
						itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
						contentStyle={{
							background: 'hsl(var(--popover))',
							border: '1px solid hsl(var(--border))',
							borderRadius: '4px'
						}}
					/>
					<Legend />
				</PieChart>
			</Div>
		</Div>
	)
}

export default TransactionHistory
