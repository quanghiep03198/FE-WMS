import { RequestHeaders } from '@/common/constants/enums'
import useQueryParams from '@/common/hooks/use-query-params'
import axiosInstance from '@/configs/axios.config'
import { useQuery } from '@tanstack/react-query'
import { useGetTenantByFactory } from '../../-hooks/use-tenacy'

export const useGetInboundReportByCommandNumber = () => {
	const { data: currentTenant } = useGetTenantByFactory()
	const { searchParams } = useQueryParams<{ order: string }>()

	return useQuery({
		queryKey: ['INBOUND_REPORT_BY_COMMAND_NUMBER', searchParams.order, currentTenant?.id],
		queryFn: async () =>
			await axiosInstance.get<ResponseBody<any[]>>(`/report/inbound/${searchParams.order}`, {
				headers: {
					[RequestHeaders.TENANT_ID]: currentTenant?.id
				}
			}),
		select: (response) => response.metadata
	})
}
export const useGetOutboundReportByCommandNumber = () => {
	const { data: currentTenant } = useGetTenantByFactory()
	const { searchParams } = useQueryParams<{ order: string }>()

	return useQuery({
		queryKey: ['OUTBOUND_REPORT_BY_PO', searchParams.order, currentTenant?.id],
		queryFn: async () =>
			await axiosInstance.get<ResponseBody<any[]>>(`/report/outbound/${searchParams.order}`, {
				headers: {
					[RequestHeaders.TENANT_ID]: currentTenant?.id
				}
			}),
		select: (response) => response.metadata
	})
}
