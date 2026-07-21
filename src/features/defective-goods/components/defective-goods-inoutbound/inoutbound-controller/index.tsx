import { Div } from '@/components/ui'
import InoutboundForm from './inoutbound-form'
import InoutboundStrategySelect from './inoutbound-strategy-select'

const InoutboundController: React.FC = () => {
	return (
		<Div className='bg-background col-span-full flex h-(--header-height) items-center justify-end px-4 py-2 @7xl:justify-between'>
			<Div className='hidden @6xl:block'>
				<InoutboundStrategySelect />
			</Div>
			<InoutboundForm />
		</Div>
	)
}

export default InoutboundController
