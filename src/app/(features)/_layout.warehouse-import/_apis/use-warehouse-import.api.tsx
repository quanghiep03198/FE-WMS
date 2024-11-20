import { ProductionImportService } from '@/services/production-import.service'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export const PRODUCTION_IMPORT_PROVIDE_TAG = 'PRODUCTION_IMPORT'
export const PRODUCTION_IMPORT_DATALIST_PROVIDE_TAG = 'PRODUCTION_IMPORT_DATALIST'

export const useGetProductionImportListQuery = () => {
	// const { t, i18n } = useTranslation()
	// const { setOrderCount } = usePageContext()
	// // Transform warehouse response data
	// const transformResponse = useCallback(
	// 	(response: ProductionImportResponse): IProductionImportOrder[] => {
	// 		const { data, count } = response.metadata
	// 		setOrderCount(count ?? 0)
	// 		return Array.isArray(data)
	// 			? data.map((item) => ({
	// 					...item,
	// 					status_approve: Boolean(item.is_disable),
	// 					type_inventorylist: t(InventoryListType[item.type_warehouse], {
	// 						ns: 'ns_inoutbound',
	// 						defaultValue: item.type_warehouse
	// 					})
	// 				}))
	// 			: []
	// 	},
	// 	[i18n.language]
	// )

	return useQuery({
		queryKey: [PRODUCTION_IMPORT_PROVIDE_TAG],
		queryFn: ProductionImportService.getProductionImportData,
		placeholderData: keepPreviousData,
		select: (response) => response.metadata
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

export const useAddImportOrderMutation = () => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: [PRODUCTION_IMPORT_PROVIDE_TAG],
		mutationFn: ProductionImportService.addImportOrder,
		onMutate: () => {
			return toast.loading(t('ns_common:notification.processing_request'))
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [PRODUCTION_IMPORT_PROVIDE_TAG] })
			return toast.success(t('ns_common:notification.success'), { id: context })
			// handleResetRowSelection()
		},
		onError: (_error, _variable, context) => {
			return toast.error(t('ns_common:notification.error'), { id: context })
		}
	})
}

export const useDeleteImportOrderMutation = () => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: [PRODUCTION_IMPORT_PROVIDE_TAG],
		mutationFn: ProductionImportService.deleteImportOrder,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			queryClient.invalidateQueries({ queryKey: [PRODUCTION_IMPORT_PROVIDE_TAG] })
		},
		onError: (_data, _variables, context) => toast.success(t('ns_common:notification.error'), { id: context })
	})
}
