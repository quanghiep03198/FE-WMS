import useAuth from '@/common/hooks/use-auth'
import { TenancyService } from '@/services/tenancy.service'
import { useQuery } from '@tanstack/react-query'

export enum TenancyQueryKeys {
	TENANT_BY_FACTORY = 'TENANT_BY_FACTORY',
	ALL_TENANTS = 'ALL_TENANTS'
}

export const useGetTenantByFactory = () => {
	const { user } = useAuth()

	return useQuery({
		queryKey: [TenancyQueryKeys.TENANT_BY_FACTORY, user.company_code],
		queryFn: TenancyService.getTenantsByFactory,
		refetchOnMount: true,
		refetchOnWindowFocus: true,
		networkMode: 'offlineFirst',
		staleTime: Infinity,
		select: (response) => response.metadata
	})
}

export const useGetAllTenants = () => {
	return useQuery({
		queryKey: [TenancyQueryKeys.ALL_TENANTS],
		queryFn: TenancyService.getAllTenants,
		refetchOnMount: true,
		refetchOnWindowFocus: true,
		networkMode: 'offlineFirst',
		staleTime: Infinity,
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})
}
