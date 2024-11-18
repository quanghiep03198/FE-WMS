import { useAuth } from '@/common/hooks/use-auth'
import { IDepartment } from '@/common/types/entities'
import { CompanyService } from '@/services/company.service'
import { DepartmentService } from '@/services/department.service'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'

export const DEPARTMENT_PROVIDE_TAG = 'WAREHOUSE_DEPARTMENT' as const
export const COMPANY_PROVIDE_TAG = 'COMPANIES' as const

type TQueryKey = readonly [typeof DEPARTMENT_PROVIDE_TAG]

export function useGetDepartmentQuery(
	options?: Partial<UseQueryOptions<ResponseBody<IDepartment[]>, AxiosError<unknown, any>, IDepartment[], TQueryKey>>
) {
	return useQuery({
		queryKey: [DEPARTMENT_PROVIDE_TAG],
		queryFn: DepartmentService.getWarehouseDepartments,
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : []),
		...options
	})
}

export const useGetUserCompany = () => {
	const { token } = useAuth()
	const { t } = useTranslation()

	return useQuery({
		queryKey: [COMPANY_PROVIDE_TAG],
		queryFn: () => CompanyService.getCompanies(),
		enabled: !!token,
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
