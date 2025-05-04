import { Div, Icon, Typography } from '@/components/ui'

const OrderDetailTableLoading: React.FC = () => {
	return (
		<Div className='absolute inset-0 z-10 grid flex-1 place-content-center text-center text-sm text-muted-foreground'>
			<Typography className='inline-flex items-center gap-x-2'>
				<Icon name='LoaderCircle' size={24} className='animate-spin' />
				Loading ...
			</Typography>
		</Div>
	)
}

export default OrderDetailTableLoading
