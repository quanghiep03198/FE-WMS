import useAuth from '@/common/hooks/use-auth'
import { TenancyService } from '@/services/tenancy.service'
import { useQuery } from '@tanstack/react-query'

export const useGetTenantByFactory = () => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['TENANTS', user.company_code],
		queryFn: TenancyService.getTenantsByFactory,
		select: (response) => response.metadata
	})
}

export const useGetAllTenants = () => {
	return useQuery({
		queryKey: ['TENANTS'],
		queryFn: TenancyService.getAllTenants,
		refetchOnMount: 'always',
		select: (response) => response.metadata
	})
}
