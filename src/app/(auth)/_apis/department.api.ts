import { IDepartment } from '@/common/types/entities'
import { DepartmentService } from '@/services/department.service'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export const DEPARTMENT_PROVIDE_TAG = 'WAREHOUSE_DEPARTMENT' as const

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
