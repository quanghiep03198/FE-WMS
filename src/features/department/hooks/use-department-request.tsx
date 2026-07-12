import { DepartmentService } from '@/features/department/services/department.service'
import { useQuery } from '@tanstack/react-query'

export enum ShapingDepartmentQueryKeys {
	SHAPING_DEPT = 'SHAPING_DEPARTMENT',
	SEWING_DEPT = 'SEWING_DEPARTMENT'
}

export const useGetShapingProductLineQuery = () => {
	return useQuery({
		queryKey: [ShapingDepartmentQueryKeys.SHAPING_DEPT],
		queryFn: DepartmentService.getShapingDepartments,
		select: (response) => response.metadata
	})
}

export const useGetSewingProductLineQuery = () => {
	return useQuery({
		queryKey: [ShapingDepartmentQueryKeys.SEWING_DEPT],
		queryFn: DepartmentService.getSewingDepartments,
		select: (response) => response.metadata
	})
}
