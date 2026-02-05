import { Card, CardAction, CardDescription, CardHeader, CardTitle, Div, Icon } from '@/components/ui'
import { Typewriter } from '@/components/ui/@custom/type-writter'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

const PlaceholderSection: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Fragment>
			<Div className='mx-auto mt-4 flex items-center'>
				<Icon
					name='BotMessageSquare'
					size={24}
					className='mr-2 duration-500 animate-in zoom-in-0 slide-in-from-bottom-2'
				/>
				&quot;
				<Typewriter text={t('ns_erp:descriptions.provide_po_info')} delay={200} className='italic' />
				&quot;
			</Div>
			<CardGroup>
				<Card>
					<CardHeader className='gap-x-4'>
						<CardAction className='col-start-1 !justify-self-start'>
							<Icon name='SearchCheck' size={32} strokeWidth={1.5} />
						</CardAction>
						<CardTitle className='col-start-2'>{t('ns_erp:titles.quick_po_search')}</CardTitle>
						<CardDescription className='col-start-2'>{t('ns_erp:descriptions.quick_po_search')}</CardDescription>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className='gap-x-4'>
						<CardAction className='col-start-1 !justify-self-start'>
							<Icon name='ReceiptText' size={32} strokeWidth={1.5} />
						</CardAction>
						<CardTitle className='col-start-2'>{t('ns_erp:titles.order_detail')}</CardTitle>
						<CardDescription className='col-start-2'>{t('ns_erp:descriptions.order_detail')}</CardDescription>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className='gap-x-4'>
						<CardAction className='col-start-1 !justify-self-start'>
							<Icon name='Ship' size={32} strokeWidth={1.5} />
						</CardAction>
						<CardTitle className='col-start-2'>{t('ns_erp:titles.shipping_detail')}</CardTitle>
						<CardDescription className='col-start-2'>{t('ns_erp:descriptions.shipping_detail')}</CardDescription>
					</CardHeader>
				</Card>
			</CardGroup>
		</Fragment>
	)
}

const CardGroup: React.FC<React.ComponentProps<'section'>> = tw.section`
	grid grid-cols-3 gap-4 md:grid-cols-1 
	[&_*[data-slot=card]>*[data-slot=card-header]]:grid-cols-[auto_1fr] 
	[&_*[data-slot=card]]:mx-auto 
	[&_*[data-slot=card]]:w-full 
	[&_*[data-slot=card]]:max-w-xl 
	[&_*[data-slot=card]]:rounded-lg`

export default PlaceholderSection
