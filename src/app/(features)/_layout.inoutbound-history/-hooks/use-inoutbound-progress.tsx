import { RequestHeaders } from '@/common/constants/enums'
import useQueryParams from '@/common/hooks/use-query-params'
import { IInboundHistory, IOutboundHistory } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { useQuery } from '@tanstack/react-query'
import { useGetTenantByFactory } from '../../-hooks/use-tenacy'

export const useGetInboundHistoryQuery = () => {
	const { data: currentTenant } = useGetTenantByFactory()
	const { searchParams } = useQueryParams<{ order: string }>()

	return useQuery({
		queryKey: ['INBOUND_HISTORY', searchParams.order, currentTenant?.id],
		queryFn: async () =>
			await axiosInstance.get<void, ResponseBody<IInboundHistory[]>>(
				`/report/inbound-history/${searchParams.order}`,
				{
					headers: {
						[RequestHeaders.TENANT_ID]: currentTenant?.id
					}
				}
			),
		select: (response) => response.metadata
	})
}
export const useGetOutboundHistoryQuery = () => {
	const { data: currentTenant } = useGetTenantByFactory()
	const { searchParams } = useQueryParams<{ order: string }>()

	return useQuery({
		queryKey: ['OUTBOUND_HISTORY', searchParams.order, currentTenant?.id],
		queryFn: async () =>
			await axiosInstance.get<void, ResponseBody<IOutboundHistory[]>>(
				`/report/outbound-history/${searchParams.order}`,
				{
					headers: {
						[RequestHeaders.TENANT_ID]: currentTenant?.id
					}
				}
			),
		select: (response) => response.metadata
	})
}
