import { RequestHeaders } from '@common/constants/enums'
import axiosInstance from '@configs/axios.config'
import { StockFlow } from '@features/finished-goods/constants/enums'
import type { IInboundHistory, IOutboundHistory } from '@features/report/types'
import useQueryParams from '@hooks/use-query-params'
import { useQuery } from '@tanstack/react-query'
import { useGetTenantByFactory } from '../../../tenancy/hooks/use-tenacy-request'

export enum InOutBoundHistoryQueryKeys {
	INBOUND_HISTORY = 'INBOUND_HISTORY',
	OUTBOUND_HISTORY = 'OUTBOUND_HISTORY'
}

export const useGetInboundHistoryQuery = () => {
	const { data: currentTenant } = useGetTenantByFactory()
	const { searchParams } = useQueryParams<{ order: string; type: StockFlow }>()

	return useQuery({
		queryKey: [InOutBoundHistoryQueryKeys.INBOUND_HISTORY, searchParams.order, currentTenant?.id],
		queryFn: async () =>
			await axiosInstance.get<void, ResponseBody<IInboundHistory>>(`/report/inbound-history/${searchParams.order}`, {
				headers: {
					[RequestHeaders.TENANT_ID]: currentTenant?.id,
					[RequestHeaders.API_VERSION]: '2'
				}
			}),
		enabled: searchParams.type === StockFlow.INBOUND,
		select: (response) => response.metadata
	})
}
export const useGetOutboundHistoryQuery = () => {
	const { data: currentTenant } = useGetTenantByFactory()
	const { searchParams } = useQueryParams<{ order: string; type: StockFlow }>()

	return useQuery({
		queryKey: [InOutBoundHistoryQueryKeys.OUTBOUND_HISTORY, searchParams.order, currentTenant?.id],
		queryFn: async () =>
			await axiosInstance.get<void, ResponseBody<IOutboundHistory>>(
				`/report/outbound-history/${searchParams.order}`,
				{
					headers: {
						[RequestHeaders.TENANT_ID]: currentTenant?.id
					}
				}
			),
		enabled: searchParams.type === StockFlow.OUTBOUND,
		select: (response) => response.metadata
	})
}
