import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'

import DetailedOutboundForm from './-detailed-outbound-form'
import StandardOutboundForm from './-standard-outbound-form'

const OutboundForm: React.FC = () => {
	return (
		<Tabs defaultValue='standard' className='w-full flex-1 basis-full'>
			<TabsList className='grid grid-cols-2'>
				<TabsTrigger value='standard'>Standard</TabsTrigger>
				<TabsTrigger value='detailed' className='w-full'>
					Detailed
				</TabsTrigger>
			</TabsList>
			<TabsContent value='standard' className='animate-in fade-in-0 slide-in-from-right-6'>
				<StandardOutboundForm />
			</TabsContent>
			<TabsContent value='detailed' className='animate-in fade-in-0 slide-in-from-left-6'>
				<DetailedOutboundForm />
			</TabsContent>
		</Tabs>
	)
}

export default OutboundForm
