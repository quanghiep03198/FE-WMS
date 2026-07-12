import type { SearchEpcParams } from '@features/finished-goods/types'
import { useQuery } from '@tanstack/react-query'
import type { StockFlow } from '../constants/enums'
import { FinishedGoodsSharedService } from '../services/finished-goods-shared.service'

export const useGetScanningEpcs = (
	stockFlow: StockFlow,
	params: SearchEpcParams,
	options: Pick<Parameter<typeof useQuery<ResponseBody<Array<{ epc: string }>>>>, 'enabled'>
) => {
	return useQuery({
		...options,
		queryKey: ['SCANNING_EPCS', stockFlow, params],
		queryFn: async () => await FinishedGoodsSharedService.getScanningEpcs(stockFlow, params),
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})
}
