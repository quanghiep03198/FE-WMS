import env from '@common/utils/env'
import { useQuery } from '@tanstack/react-query'
import { TenancyService } from '../services/tenancy.service'

export enum TenancyQueryKeys {
	TENANT_BY_FACTORY = 'TENANT_BY_FACTORY',
	ALL_TENANTS = 'ALL_TENANTS'
}

/**
 * @deprecated
 * @returns
 */
export const useGetTenantByFactory = () => {
	return useQuery({
		queryKey: [TenancyQueryKeys.TENANT_BY_FACTORY, env<FactoryCode>('VITE_APP_TENANT')],
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
