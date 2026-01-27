import useAuth from '@/common/hooks/use-auth'
import { IDepartment } from '@/common/types/entities'
import { CompanyService } from '@/services/company.service'
import { DepartmentService } from '@/services/department.service'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'

export enum WorkplaceQueryKeys {
	DEPARTMENT = 'WAREHOUSE_DEPARTMENT',
	COMPANY = 'COMPANIES'
}

type TQueryKey = readonly [typeof WorkplaceQueryKeys.DEPARTMENT]

export function useGetDepartmentQuery(
	options?: Partial<UseQueryOptions<ResponseBody<IDepartment[]>, AxiosError<unknown, any>, IDepartment[], TQueryKey>>
) {
	return useQuery({
		queryKey: [WorkplaceQueryKeys.DEPARTMENT],
		queryFn: DepartmentService.getWarehouseDepartments,
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : []),
		...options
	})
}

/**
 *
 * @deprecated
 * @returns
 */
export const useGetUserCompany = () => {
	const { accessToken } = useAuth()
	const { t } = useTranslation()

	return useQuery({
		queryKey: [WorkplaceQueryKeys.COMPANY],
		queryFn: () => CompanyService.getCompanies(),
		enabled: !!accessToken,
		select: (data) => {
			return Array.isArray(data.metadata)
				? data.metadata.map((item) => ({
						...item,
						company_name: t(`ns_company:factories.${item.factory_code}`, { defaultValue: item.factory_code })
					}))
				: []
		}
	})
}
