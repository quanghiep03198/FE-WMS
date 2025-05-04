import { cn } from '@/common/utils/cn'
import { buttonVariants, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Icon } from '@/components/ui'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useTranslation } from 'react-i18next'
import OrderSizeDetailTable from './-order-detail-table'

const OrderDetailTableDialog = () => {
	const { t } = useTranslation()

	return (
		<Dialog>
			<DialogTrigger className={cn(buttonVariants({ size: 'lg', className: 'w-full' }))}>
				{t('ns_common:actions.detail')}
				<Icon name='ArrowUpRight' role='img' />
			</DialogTrigger>
			<DialogContent className='flex h-screen max-w-[screen] flex-col rounded-none border-none'>
				<DialogHeader className='basis-auto'>
					<DialogTitle>{t('ns_inoutbound:titles.order_sizing_list')}</DialogTitle>
					<DialogDescription>{t('ns_inoutbound:description.order_sizing_list')}</DialogDescription>
				</DialogHeader>
				<OrderSizeDetailTable />
			</DialogContent>
		</Dialog>
	)
}

export default OrderDetailTableDialog
