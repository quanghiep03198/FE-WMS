import { Div } from '@components/ui'
import MQTTVisualCard from './mqtt-visual-card'
import OSVisualCard from './os-visual-card'
import RealtimeVisualCard from './realtime-visual-card'
import StorageVisual from './storage-visual-card'

const VisualBentoGrid: React.FC = () => {
	return (
		<Div
			id='features'
			className='max-w-8xl @container/visual relative z-30 mx-auto grid w-full grid-cols-6 gap-4 overflow-hidden p-2 py-20 sm:grid-cols-1 lg:grid-flow-row lg:p-6 xl:grid-flow-row xl:p-6'>
			<Div className='col-span-full sm:col-span-full md:col-span-full lg:order-2 lg:col-span-3 xl:col-span-2 xl:row-span-2'>
				<MQTTVisualCard />
			</Div>
			<Div className='order-first col-span-full xl:order-2 xl:col-span-2 xl:row-span-1'>
				<OSVisualCard />
			</Div>
			<Div className='col-span-full sm:col-span-full md:col-span-full lg:col-span-3 xl:order-2 xl:col-span-2 xl:row-span-1'>
				<RealtimeVisualCard />
			</Div>
			<Div className='col-span-full *:w-full lg:order-last lg:col-span-full xl:order-last xl:col-span-4 xl:row-span-1'>
				<StorageVisual />
			</Div>
		</Div>
	)
}

export default VisualBentoGrid
