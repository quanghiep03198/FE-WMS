import { Div, Icon, TIconProps, Typography } from '@/components/ui';
import { useRef } from 'react';
import { useScrollIntoView } from '..';

type FeatureItemProps = {
	icon: TIconProps['name'];
	title: string;
	description: string;
};

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
];

const FeaturesSection: React.FunctionComponent = () => {
	const sectionRef = useRef<HTMLDivElement>(null);

	useScrollIntoView({
		hashMatch: 'outstanding-features',
		target: sectionRef.current
	});

	return (
		<Div
			ref={sectionRef}
			as='section'
			className='xxl:max-w-8xl relative mx-auto flex max-w-4xl flex-grow items-center justify-center px-6 sm:px-4 xl:max-w-7xl'>
			<Div className='space-y-20'>
				<Div className='max-w-4xl text-left'>
					<Typography color='primary' variant='small' className='mb-2 !text-base font-medium'>
						No more paperwork
					</Typography>
					<Typography variant='h3' className='mb-6'>
						Comprehensive solutions for Warehouse Management
					</Typography>
					<Typography variant='p' className='text-lg'></Typography>
				</Div>

				<Div className='grid flex-col items-start gap-6 xl:grid-cols-3'>
					{mainFeatures.map((item, index) => (
						<FeatureItem {...item} key={index} />
					))}
				</Div>
			</Div>
		</Div>
	);
};

const FeatureItem: React.FC<FeatureItemProps> = (props) => {
	return (
		<Div className='flex items-start gap-x-4'>
			<Div className='inline-flex items-center justify-center rounded-full bg-primary/10 p-3'>
				<Icon name={props.icon} strokeWidth={1.5} className='inline-flex h-6 w-6 stroke-primary' />
			</Div>
			<Div className='space-y-2'>
				<Typography className='font-medium'>{props.title}</Typography>
				<Typography variant='small' color='muted'>
					{props.description}
				</Typography>
			</Div>
		</Div>
	);
};

export default FeaturesSection;
