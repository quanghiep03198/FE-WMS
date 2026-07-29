import { DepartmentService } from '@features/department/services/department.service'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { IDepartment } from '../types'

export enum DepartmentQueryKeys {
	SHAPING_DEPT = 'SHAPING_DEPARTMENT',
	SEWING_DEPT = 'SEWING_DEPARTMENT',
	WAREHOUSE_DEPT = 'WAREHOUSE_DEPARTMENT'
}

export function useGetDepartmentQuery(
	options?: Partial<
		UseQueryOptions<
			ResponseBody<IDepartment[]>,
			AxiosError<unknown, any>,
			IDepartment[],
			DepartmentQueryKeys.WAREHOUSE_DEPT[]
		>
	>
) {
	return useQuery({
		queryKey: [DepartmentQueryKeys.WAREHOUSE_DEPT],
		queryFn: DepartmentService.getWarehouseDepartments,
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : []),
		...options
	})
}

export const useGetShapingProductLineQuery = () => {
	return useQuery({
		queryKey: [DepartmentQueryKeys.SHAPING_DEPT],
		queryFn: DepartmentService.getShapingDepartments,
		select: (response) => response.metadata
	})
}

export const useGetSewingProductLineQuery = () => {
	return useQuery({
		queryKey: [DepartmentQueryKeys.SEWING_DEPT],
		queryFn: DepartmentService.getSewingDepartments,
		select: (response) => response.metadata
	})
}
