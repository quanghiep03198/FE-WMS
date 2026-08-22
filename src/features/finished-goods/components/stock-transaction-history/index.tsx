import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@components/ui'
import type { StockFlow } from '@features/finished-goods/constants/enums'
import React from 'react'
import { useTranslation } from 'react-i18next'
import StockTransactionHistoryTable from './stock-transaction-history-table'

type StockTransactionHistoryProps = {
	stockFlow: StockFlow
}

const StockTransactionHistorySheet: React.FC<StockTransactionHistoryProps> = ({ stockFlow }) => {
	const { t } = useTranslation()

	return (
		<Sheet>
			<SheetTrigger id='stock-transaction-sheet-trigger' />
			<SheetContent className='max-w-3xl'>
				<SheetHeader>
					<SheetTitle>{t('ns_inoutbound:titles.inoutbound_history_lookup')}</SheetTitle>
					<SheetDescription>{t('ns_inoutbound:description.current_stock_transaction')}</SheetDescription>
				</SheetHeader>
				<StockTransactionHistoryTable stockFlow={stockFlow} />
			</SheetContent>
		</Sheet>
	)
}

export default StockTransactionHistorySheet
