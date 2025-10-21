import useQueryParams from '@/common/hooks/use-query-params'
import { OrderService } from '@/services/order.service'
import { useQuery } from '@tanstack/react-query'

export const usePurchaseOrderDetailQuery = () => {
	const { searchParams } = useQueryParams<{ po?: string }>()

	return useQuery({
		queryKey: ['PURCHASE_ORDER_SEEKING', searchParams.po],
		queryFn: async () => await OrderService.getPurchaseOrderSizeRun(searchParams.po),
		enabled: !!searchParams.po,
		select: (response) => response.metadata
	})
}
