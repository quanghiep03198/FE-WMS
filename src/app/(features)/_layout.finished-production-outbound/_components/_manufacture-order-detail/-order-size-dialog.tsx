import { cn } from '@/common/utils/cn'
import { buttonVariants, Dialog, DialogContent, DialogTrigger } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import OrderSizeDetailTable from './-order-size-table'

const OrderSizeTableDialog = () => {
	const { t } = useTranslation()

	return (
		<Dialog>
			<DialogTrigger className={cn(buttonVariants({ size: 'lg', className: 'w-full' }))}>
				{t('ns_common:actions.detail')}
			</DialogTrigger>
			<DialogContent>
				<OrderSizeDetailTable />
			</DialogContent>
		</Dialog>
	)
}

export default OrderSizeTableDialog
