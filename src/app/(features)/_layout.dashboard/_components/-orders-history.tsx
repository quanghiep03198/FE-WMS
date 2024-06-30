import { Badge, DataTable, Div, Icon, Typography, buttonVariants } from '@/components/ui'
import { recentExports } from '@/mocks/dashboard.data'
import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'

const TransactionHistory: React.FC = () => {
	const columnHelper = createColumnHelper<any>()

	const columns = useMemo(
		() => [
			columnHelper.accessor('company_name', {
				header: 'Company Name',
				enableSorting: true,
				size: 200
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

			columnHelper.accessor('amount', {
				header: 'Amount',
				enableSorting: true,
				size: 200
			})
		],
		[]
	)

	return (
		<Div className='col-span-full lg:col-span-2 xl:col-span-2'>
			<Div className='mb-2 flex flex-row items-center justify-between'>
				<Typography className='text-sm font-medium'>Orders History</Typography>
				<Link className={buttonVariants({ variant: 'link', className: 'gap-x-2' })}>
					View all <Icon name='ArrowRight' />
				</Link>
			</Div>

			<DataTable
				data={recentExports}
				columns={columns}
				paginationProps={{ hidden: true }}
				toolbarProps={{ hidden: true }}
				enableColumnResizing={true}
				containerProps={{
					style: { height: screen.availHeight / 3 }
				}}
			/>
		</Div>
	)
}

export default TransactionHistory
