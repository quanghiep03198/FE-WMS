import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'

import NonSeparatedOutboundForm from './-non-separated-po-form'
import SeparatedPoOutboundForm from './-separated-po-form'

const OutboundForm: React.FC = () => {
	return (
		<Tabs defaultValue='standard' className='w-full flex-1 basis-full'>
			<TabsList className='grid grid-cols-2'>
				<TabsTrigger value='standard'>Non-Separated PO</TabsTrigger>
				<TabsTrigger value='detailed' className='w-full'>
					Separated PO
				</TabsTrigger>
			</TabsList>
			<TabsContent value='standard' className='animate-in fade-in-0 slide-in-from-right-4'>
				<NonSeparatedOutboundForm />
			</TabsContent>
			<TabsContent value='detailed' className='animate-in fade-in-0 slide-in-from-left-4'>
				<SeparatedPoOutboundForm />
			</TabsContent>
		</Tabs>
	)
}

export default OutboundForm
