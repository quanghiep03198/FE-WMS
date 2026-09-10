import type { IProductSpecification } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { useQuery } from '@tanstack/react-query'

export enum ProductSpecificationQueryKey {
	PRODUCT_SPECIFICATION = 'PRODUCT_SPECIFICATION'
}

export const useGetProductSpecificationQuery = () => {
	return useQuery({
		queryKey: [ProductSpecificationQueryKey.PRODUCT_SPECIFICATION],
		queryFn: async () =>
			await axiosInstance.get<void, ResponseBody<IProductSpecification[]>>('/product-specification'),
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})
}
