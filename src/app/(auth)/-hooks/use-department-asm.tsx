import type { IDepartment } from '@/common/types/entities'
import { DepartmentService } from '@/services/department.service'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

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
