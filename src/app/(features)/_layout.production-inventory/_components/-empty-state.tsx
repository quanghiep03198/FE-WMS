import { Div, Icon, Typography } from '@/components/ui'
import FilterBox from './-filter-box'

const inventoryHints: Array<{
	icon: React.ComponentProps<typeof Icon>['name']
	title: string
	description: string
}> = [
	{
		icon: 'PackageOpen',
		title: 'Inventory by Size',
		description: 'Results will appear here after you run a search for outbound-order estimates.'
	},
	{
		icon: 'Forklift',
		title: 'Inbound Stock Audit',
		description: 'Inbound stock records will populate this section once you perform a search.'
		// description: 'Estimate the inventory levels based on the current production and shipping status.'
	},
	{
		icon: 'Ship',
		title: 'Estimated Outgoing Orders',
		description: `Results will appear here after you run a search for outbound-order estimates.`
	}
]

const EmptyState: React.FC = () => {
	return (
		<Div className='mx-auto flex h-full max-w-3xl flex-col items-stretch gap-y-6 py-10'>
			<Div className='flex flex-col items-center gap-y-2'>
				<Div className='mb-2'>
					<Icon name='PackageSearch' size={48} strokeWidth={1} />
				</Div>
				<Typography variant='h5' className='text-center capitalize'>
					Production inventory estimation
				</Typography>
				<Typography variant='small' color='muted'>
					Estimate the inventory levels based on the current production and shipping status.
				</Typography>
			</Div>
			<FilterBox />
			<Div className='flex flex-col items-stretch divide-y'>
				{inventoryHints.map((item, index) => (
					<Div key={index.toString()} className='grid grid-cols-[3rem_auto] items-center py-6'>
						<Icon name={item.icon} size={32} strokeWidth={1} />
						<Div className='space-y-2'>
							<Typography variant='small' className='line-clamp-1'>
								{item.title}
							</Typography>
							<Typography variant='small' color='muted'>
								{item.description}
							</Typography>
						</Div>
					</Div>
				))}
			</Div>
			{/* <Separator /> */}
		</Div>
	)
}

export default EmptyState
