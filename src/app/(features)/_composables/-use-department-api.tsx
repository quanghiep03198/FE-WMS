import { IDepartment } from '@/common/types/entities'
import { WarehouseService } from '@/services/warehouse.service'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export const DEPARTMENT_PROVIDE_TAG = 'DEPARTMENT' as const

type TQueryKey = readonly [typeof DEPARTMENT_PROVIDE_TAG, string]

export function useGetDepartmentQuery<TData = IDepartment[]>(
	userCompany,
	options?: Partial<UseQueryOptions<ResponseBody<IDepartment[]>, AxiosError<unknown, any>, TData, TQueryKey>>
) {
	return useQuery({
		queryKey: [DEPARTMENT_PROVIDE_TAG, userCompany],
		queryFn: () => WarehouseService.getWarehouseDepartments(userCompany),
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : []) as TData,
		...options
	})
}
