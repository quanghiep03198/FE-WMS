import useAuth from '@/common/hooks/use-auth'
import { TenancyService } from '@/services/tenancy.service'
import { useQuery } from '@tanstack/react-query'

export const useGetTenantByFactory = () => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['TENANT', user.company_code],
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
		queryKey: ['TENANTS'],
		queryFn: TenancyService.getAllTenants,
		refetchOnMount: true,
		refetchOnWindowFocus: true,
		networkMode: 'offlineFirst',
		staleTime: Infinity,
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})
}
