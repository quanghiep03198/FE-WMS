import { IProductionImportOrder } from '@/common/types/entities'
import { ProductionImportService } from '@/services/production-import.service'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { InventoryListType } from '../_constants/warehouse-import.enum'

export const PRODUCTION_IMPORT_PROVIDE_TAG = 'PRODUCTION_IMPORT'
export const PRODUCTION_IMPORT_DATALIST_PROVIDE_TAG = 'PRODUCTION_IMPORT_DATALIST'

export const useGetProductionImportListQuery = () => {
	const { t, i18n } = useTranslation()

	// Transform warehouse response data
	const transformResponse = useCallback(
		(response: ResponseBody<IProductionImportOrder[]>) => {
			const { metadata } = response
			return Array.isArray(metadata)
				? metadata.map((item) => ({
						...item,
						status_approve: Boolean(item.is_disable),
						type_inventorylist: t(InventoryListType[item.type_warehouse], {
							ns: 'ns_inoutbound',
							defaultValue: item.type_warehouse
						})
					}))
				: []
		},
		[i18n.language]
	)

	return useQuery({
		queryKey: [PRODUCTION_IMPORT_PROVIDE_TAG],
		queryFn: ProductionImportService.getProductionImportData,
		placeholderData: keepPreviousData,
		select: transformResponse
	})
}

export const useGetProductionImportDetailsQuery = (orderCode: string) => {
	return useQuery({
		queryKey: [PRODUCTION_IMPORT_PROVIDE_TAG],
		queryFn: () => ProductionImportService.getProductionImportDetails(orderCode),
		placeholderData: keepPreviousData
	})
}

export const useGetProductionImportDatalistQuery = () => {
	return useQuery({
		queryKey: [PRODUCTION_IMPORT_DATALIST_PROVIDE_TAG],
		queryFn: ProductionImportService.getProductionImportDatalist,
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})
}
