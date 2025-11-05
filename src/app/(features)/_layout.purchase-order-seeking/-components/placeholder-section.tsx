import { cn } from '@/common/utils/cn'
import { Card, CardAction, CardDescription, CardHeader, CardTitle, Div, Icon } from '@/components/ui'
import { Typewriter } from '@/components/ui/@custom/type-writter'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

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
			<Div
				as='section'
				className={cn(
					'grid grid-cols-3 gap-x-4',
					'[&_*[data-slot=card]]:rounded-lg'
					// 'grid w-full grid-cols-3 gap-x-4 gap-y-3 xxl:grid-cols-6 xxl:grid-rows-3 xxl:gap-x-9',
				)}>
				<Card>
					<CardHeader className='gap-x-4'>
						<CardAction className='col-start-1'>
							<Icon name='SearchCheck' size={32} strokeWidth={1.5} />
						</CardAction>
						<CardTitle className='col-start-2'>{t('ns_erp:titles.quick_po_search')}</CardTitle>
						<CardDescription className='col-start-2'>{t('ns_erp:descriptions.quick_po_search')}</CardDescription>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className='gap-x-4'>
						<CardAction className='col-start-1'>
							<Icon name='ReceiptText' size={32} strokeWidth={1.5} />
						</CardAction>
						<CardTitle className='col-start-2'>{t('ns_erp:titles.order_detail')}</CardTitle>
						<CardDescription className='col-start-2'>{t('ns_erp:descriptions.order_detail')}</CardDescription>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className='gap-x-4'>
						<CardAction className='col-start-1'>
							<Icon name='Ship' size={32} strokeWidth={1.5} />
						</CardAction>
						<CardTitle className='col-start-2'>{t('ns_erp:titles.shipping_detail')}</CardTitle>
						<CardDescription className='col-start-2'>{t('ns_erp:descriptions.shipping_detail')}</CardDescription>
					</CardHeader>
				</Card>
			</Div>
		</Fragment>
	)
}

export default PlaceholderSection
