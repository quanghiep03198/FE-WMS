import { Div, Icon, IconProps, Typography } from '@/components/ui'

type FeatureItemProps = {
	icon: IconProps['name']
	title: string
	description: string
}

const mainFeatures: Array<FeatureItemProps> = [
	{
		icon: 'Warehouse',
		title: 'Inventory Tracking and Control',
		description:
			'i-WMS can help warehouse managers keep track of inventory levels, locations, and movement within the warehouse, ensuring optimal stock levels and minimizing stockouts. '
	},
	{
		icon: 'ScanBarcode',
		title: 'Barcode Scanning and RFID Integration',
		description:
			'Integrating barcode scanning and RFID in WMS allows for precise and efficient inventory tracking across the warehouse. By providing improved visibility, faster scanning, and more accurate data capture, these features help ensure precise inventory tracking and management.'
	},
	{
		icon: 'FileText',
		title: 'Reporting and Analytics',
		description:
			'i-WMS allows warehouse managers to monitor performance, identify bottlenecks and performance gaps, and supply insights for optimization.'
	}
]

const FeaturesSection: React.FunctionComponent = () => {
	return (
		<Div className='flex flex-col justify-center space-y-16 sm:space-y-8' id='outstanding-features' as='section'>
			<Div className='max-w-4xl space-y-1.5 text-left sm:text-center'>
				<Typography color='primary' variant='small' className='!text-base font-medium sm:text-sm sm:font-normal'>
					No more paperwork
				</Typography>
				<Typography variant='h3' className='sm:mb-4 sm:text-xl'>
					Comprehensive solutions for Warehouse Management
				</Typography>
			</Div>
			<Div className='grid flex-col items-start gap-6 xl:grid-cols-3'>
				{mainFeatures.map((item, index) => (
					<FeatureItem {...item} key={index} />
				))}
			</Div>
		</Div>
	)
}

const FeatureItem: React.FC<FeatureItemProps> = (props) => {
	return (
		<Div className='flex items-start gap-x-4'>
			<Div className='grid aspect-square size-12 place-content-center rounded-lg bg-accent'>
				<Icon name={props.icon} strokeWidth={1.5} size={24} />
			</Div>
			<Div className='space-y-2'>
				<Typography className='font-medium'>{props.title}</Typography>
				<Typography variant='small' color='muted'>
					{props.description}
				</Typography>
			</Div>
		</Div>
	)
}

export default FeaturesSection
