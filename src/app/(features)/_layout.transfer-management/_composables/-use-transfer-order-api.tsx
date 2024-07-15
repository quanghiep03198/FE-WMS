import { TransferOrderService } from '@/services/transfer-order.service'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { UpdateTransferOrderValues } from '../_schemas/-transfer-order.schema'
import useQueryParams from '@/common/hooks/use-query-params'

export const TRANSFER_ORDER_PROVIDE_TAG = 'TRANSFER_ORDER'
const TRANSFER_ORDER_DATALIST_PROVIDE_TAG = 'TRANSFER_ORDER_DATALIST'

export const useGetTransferOrderQuery = () => {
	return useQuery({
		queryKey: [TRANSFER_ORDER_PROVIDE_TAG],
		queryFn: TransferOrderService.getTransferOrderList,
		placeholderData: keepPreviousData,
		select: (response) => response.metadata
	})
}

export const useGetTransferOrderDatalist = () => {
	const { searchParams } = useQueryParams()

	return useQuery({
		queryKey: [TRANSFER_ORDER_DATALIST_PROVIDE_TAG, searchParams],
		queryFn: () => TransferOrderService.getTransferOrderDatalist(searchParams),
		placeholderData: keepPreviousData,
		select: (response) => response.metadata
	})
}

export const useAddTransferOrderMutation = () => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: [TRANSFER_ORDER_PROVIDE_TAG],
		mutationFn: TransferOrderService.addTransferOrder,
		onMutate: () => {
			return toast.loading(t('ns_common:notification.processing_request'))
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [TRANSFER_ORDER_PROVIDE_TAG] })
			return toast.success(t('ns_common:notification.success'), { id: context })
			// handleResetRowSelection()
		},
		onError: (_error, _variable, context) => {
			return toast.error(t('ns_common:notification.error'), { id: context })
		}
	})
}

export const useUpdateTransferOrderMutation = () => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [TRANSFER_ORDER_PROVIDE_TAG],
		mutationFn: ({ transferOrderCode, payload }: { transferOrderCode: string; payload: UpdateTransferOrderValues }) =>
			TransferOrderService.updateTransferOrder(transferOrderCode, payload),
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			queryClient.invalidateQueries({ queryKey: [TRANSFER_ORDER_PROVIDE_TAG] })
		},
		onError: (_data, _variables, context) => toast.success(t('ns_common:notification.error'), { id: context })
	})
}

export const useUpdateMultiTransferOrderMutation = () => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [TRANSFER_ORDER_PROVIDE_TAG],
		mutationFn: TransferOrderService.updateMultiTransferOrder,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			queryClient.invalidateQueries({ queryKey: [TRANSFER_ORDER_PROVIDE_TAG] })
		},
		onError: (_data, _variables, context) => toast.success(t('ns_common:notification.error'), { id: context })
	})
}

export const useUpdateTransferOrderDetailMutation = () => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [TRANSFER_ORDER_PROVIDE_TAG],
		mutationFn: TransferOrderService.updateTransferOrderDetail,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			queryClient.invalidateQueries({ queryKey: [TRANSFER_ORDER_PROVIDE_TAG] })
		},
		onError: (_data, _variables, context) => toast.success(t('ns_common:notification.error'), { id: context })
	})
}

export const useDeleteTransferOrderMutation = () => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: [TRANSFER_ORDER_PROVIDE_TAG],
		mutationFn: TransferOrderService.deleteTransferOrder,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			queryClient.invalidateQueries({ queryKey: [TRANSFER_ORDER_PROVIDE_TAG] })
		},
		onError: (_data, _variables, context) => toast.success(t('ns_common:notification.error'), { id: context })
	})
}
