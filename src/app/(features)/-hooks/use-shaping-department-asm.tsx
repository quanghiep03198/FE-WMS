import { DepartmentService } from '@/services/department.service'
import { useQuery } from '@tanstack/react-query'

export enum ShapingDepartmentQueryKeys {
	SHAPING_DEPT = 'SHAPING_DEPARTMENT'
}

export const useGetShapingProductLineQuery = () => {
	return useQuery({
		queryKey: [ShapingDepartmentQueryKeys.SHAPING_DEPT],
		queryFn: DepartmentService.getShapingDepartments,
		select: (response) => response.metadata
	})
}
