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
} from '@components/ui'

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
		<Tabs className='w-full flex-1 basis-full' defaultValue={OutboundFormType.CENTRALIZED_PO}>
			<TabsList className='grid grid-cols-2'>
				<HoverCard closeDelay={0} openDelay={750}>
					<HoverCardTrigger className='flex'>
						<TabsTrigger className='flex-1' value={OutboundFormType.CENTRALIZED_PO}>
							{t('ns_erp:fields.centralized_po')}
						</TabsTrigger>
					</HoverCardTrigger>
					<HoverCardContent align='start' className='w-64' sideOffset={8}>
						<Div className='flex justify-between space-x-4'>
							<Icon className='stroke-active min-w-5' name='Info' size={22} />
							<Typography as='small' className='flex-1 text-pretty' variant='small'>
								{t('ns_erp:descriptions.centralized_po')}
							</Typography>
						</Div>
					</HoverCardContent>
				</HoverCard>
				<HoverCard closeDelay={0} openDelay={750}>
					<HoverCardTrigger className='flex'>
						<TabsTrigger className='flex-1' value={OutboundFormType.DECENTRALIZED_PO}>
							{t('ns_erp:fields.decentralized_po')}
						</TabsTrigger>
					</HoverCardTrigger>
					<HoverCardContent align='end' className='w-64' sideOffset={8}>
						<Div className='flex justify-between space-x-4'>
							<Icon className='stroke-active min-w-5' name='Info' size={22} />
							<Typography as='small' className='flex-1 text-pretty' variant='small'>
								{t('ns_erp:descriptions.decentralized_po')}
							</Typography>
						</Div>
					</HoverCardContent>
				</HoverCard>
			</TabsList>
			<TabsContent className='animate-in fade-in-0 slide-in-from-right-4' value={OutboundFormType.CENTRALIZED_PO}>
				<CentralizedPoOutboundForm />
			</TabsContent>
			<TabsContent className='animate-in fade-in-0 slide-in-from-left-4' value={OutboundFormType.DECENTRALIZED_PO}>
				<DecentralizedPoOutboundForm />
			</TabsContent>
		</Tabs>
	)
}

export default OutboundForm
