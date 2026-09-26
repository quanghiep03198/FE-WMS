import { RequestHeaders } from '@common/constants/enums'
import axiosInstance from '@configs/axios.config'
import { StockFlow } from '@features/finished-goods/constants/enums'
import type { IInboundHistory, IOutboundHistory } from '@features/report/types'
import useQueryParams from '@hooks/use-query-params'
import { useQuery } from '@tanstack/react-query'

export enum InOutBoundHistoryQueryKeys {
	INBOUND_HISTORY = 'INBOUND_HISTORY',
	OUTBOUND_HISTORY = 'OUTBOUND_HISTORY'
}

export const useGetInboundHistoryQuery = () => {
	const { searchParams } = useQueryParams<{ order: string; type: StockFlow }>()

	return useQuery({
		queryKey: [InOutBoundHistoryQueryKeys.INBOUND_HISTORY, searchParams.order],
		queryFn: async () =>
			await axiosInstance.get<void, ResponseBody<IInboundHistory>>(`/report/inbound-history/${searchParams.order}`, {
				headers: { [RequestHeaders.API_VERSION]: '2' }
			}),
		enabled: searchParams.type === StockFlow.INBOUND,
		select: (response) => response.metadata
	})
}
export const useGetOutboundHistoryQuery = () => {
	const { searchParams } = useQueryParams<{ order: string; type: StockFlow }>()

	return useQuery({
		queryKey: [InOutBoundHistoryQueryKeys.OUTBOUND_HISTORY, searchParams.order],
		queryFn: async () =>
			await axiosInstance.get<void, ResponseBody<IOutboundHistory>>(
				`/report/outbound-history/${searchParams.order}`
			),
		enabled: searchParams.type === StockFlow.OUTBOUND,
		select: (response) => response.metadata
	})
}
