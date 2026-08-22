import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { StockFlow } from '../constants/enums'
import { FinishedGoodsStockService } from '../services/finished-goods-stock.service'

export enum StockTransactionQueryKey {
	STOCK_TRANSACTION = 'STOCK_TRANSACTION'
}

export const useGetCurrentStockTransactionQuery = (stockFlow: StockFlow) => {
	return useQuery({
		queryKey: [StockTransactionQueryKey.STOCK_TRANSACTION, stockFlow],
		queryFn: async () => await FinishedGoodsStockService.getCurrentStockTransaction(stockFlow),
		select: (response) => response.metadata
	})
}

export const useRollbackStockTransactionMutation = (stockFlow: StockFlow) => {
	const { t } = useTranslation()

	return useMutation({
		meta: { invalidates: [[StockTransactionQueryKey.STOCK_TRANSACTION, stockFlow]] },
		mutationFn: async (transactionId: string) =>
			await FinishedGoodsStockService.rollbackStockTx(stockFlow, transactionId),
		onSuccess: () => toast.success(t('ns_common:notification.success')),
		onError: () => toast.error(t('ns_common:notification.error'))
	})
}
