import { useAuth } from '@/common/hooks/use-auth'
import { TenancyService } from '@/services/tenancy.service'
import { useQuery } from '@tanstack/react-query'

export const useGetDefaultTenantByFactory = () => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['DEFAULT_TENANT', user.company_code],
		queryFn: TenancyService.getDefaultTenantByFactory,
		refetchOnMount: 'always',
		select: (response) => response.metadata
	})
}
