import {
	Div,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Typography
} from '@/components/ui'

import { useTranslation } from 'react-i18next'
import CentralizedPoOutboundForm from './centralized-po-form'
import DecentralizedPoOutboundForm from './decentralized-po-form'

enum OutboundFormType {
	CENTRALIZED_PO = 'centralized-po',
	DECENTRALIZED_PO = 'decentralized-po'
}

const OutboundForm: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Tabs defaultValue={OutboundFormType.CENTRALIZED_PO} className='w-full flex-1 basis-full'>
			<TabsList className='grid grid-cols-2'>
				<HoverCard openDelay={750} closeDelay={0}>
					<HoverCardTrigger className='flex'>
						<TabsTrigger className='flex-1' value={OutboundFormType.CENTRALIZED_PO}>
							{t('ns_erp:fields.centralized_po')}
						</TabsTrigger>
					</HoverCardTrigger>
					<HoverCardContent className='w-64' align='start' sideOffset={8}>
						<Div className='flex justify-between space-x-4'>
							<Icon name='Info' size={22} className='min-w-5 stroke-active' />
							<Typography as='small' variant='small' className='flex-1 text-pretty'>
								{t('ns_erp:descriptions.centralized_po')}
							</Typography>
						</Div>
					</HoverCardContent>
				</HoverCard>
				<HoverCard openDelay={750} closeDelay={0}>
					<HoverCardTrigger className='flex'>
						<TabsTrigger className='flex-1' value={OutboundFormType.DECENTRALIZED_PO}>
							{t('ns_erp:fields.decentralized_po')}
						</TabsTrigger>
					</HoverCardTrigger>
					<HoverCardContent className='w-64' align='end' sideOffset={8}>
						<Div className='flex justify-between space-x-4'>
							<Icon name='Info' size={22} className='min-w-5 stroke-active' />
							<Typography as='small' variant='small' className='flex-1 text-pretty'>
								{t('ns_erp:descriptions.decentralized_po')}
							</Typography>
						</Div>
					</HoverCardContent>
				</HoverCard>
			</TabsList>
			<TabsContent value={OutboundFormType.CENTRALIZED_PO} className='animate-in fade-in-0 slide-in-from-right-4'>
				<CentralizedPoOutboundForm />
			</TabsContent>
			<TabsContent value={OutboundFormType.DECENTRALIZED_PO} className='animate-in fade-in-0 slide-in-from-left-4'>
				<DecentralizedPoOutboundForm />
			</TabsContent>
		</Tabs>
	)
}

export default OutboundForm
