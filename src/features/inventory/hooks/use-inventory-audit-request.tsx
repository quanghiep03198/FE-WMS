import { InventoryService } from '@features/inventory/services/inventory.service'
import useQueryParams from '@hooks/use-query-params'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { InventoryAuditFormValues } from '../schemas/inventory-audit.schema'
import type { BaseUpdateUpdateQuery } from '../types'

export enum InventoryAuditQueryKeys {
	INVENTORY_AUDIT = 'INVENTORY_AUDIT'
}

export const useGetInventoryAuditReport = (params?: { 'month:eq': string }) => {
	return useQuery({
		queryKey: [InventoryAuditQueryKeys.INVENTORY_AUDIT, params],
		queryFn: async () => await InventoryService.getInventoryAuditReport(params),
		refetchOnWindowFocus: false,
		select: (response) => response.metadata
	})
}

export const useCheckoutInventoryAuditMutation = () => {
	const { searchParams } = useQueryParams<{ 'month:eq': string }>({ 'month:eq': format(new Date(), 'yyyy-MM') })

	const toastId = useRef<string | number | undefined>(undefined)
	const { t } = useTranslation()

	return useMutation({
		meta: {
			invalidates: [[InventoryAuditQueryKeys.INVENTORY_AUDIT, searchParams]]
		},
		mutationFn: async () => {
			return await InventoryService.checkoutMonthlyInventory(searchParams['month:eq'])
		},
		onMutate: () => {
			toastId.current = toast.loading(t('ns_common:notification.processing_request'))
		},
		onSuccess: () => {
			toast.success(t('ns_common:notification.success'), { id: toastId.current })
		},
		onError: () => {
			toast.error(t('ns_common:notification.error'), { id: toastId.current })
		}
	})
}

export const useInventoryAuditMutation = (
	queries: Omit<BaseUpdateUpdateQuery, 'size_numcode'>,
	signal: AbortSignal
) => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()
	const { searchParams } = useQueryParams<{ 'month:eq': string }>({ 'month:eq': format(new Date(), 'yyyy-MM') })

	return useMutation({
		meta: {
			invalidates: [[InventoryAuditQueryKeys.INVENTORY_AUDIT, searchParams]]
		},
		mutationFn: async (payload: InventoryAuditFormValues['data']) => {
			return await InventoryService.updateInventoryAuditReport(
				signal,
				{ ...queries, year_month: searchParams['month:eq'] },
				payload
			)
		},
		onMutate: async (variable) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({
				queryKey: [InventoryAuditQueryKeys.INVENTORY_AUDIT, searchParams],
				exact: true
			})
			// Snapshot the previous value
			const previousData = queryClient.getQueryData([InventoryAuditQueryKeys.INVENTORY_AUDIT, searchParams])

			// Optimistically update to the new value
			queryClient.setQueryData([InventoryAuditQueryKeys.INVENTORY_AUDIT, searchParams], variable)
			return { previousData }
		},
		onSuccess: () => {
			toast.success(t('ns_common:notification.success'))
		},
		onError: (_error, _variable, context) => {
			toast.error(t('ns_common:notification.error'))
			queryClient.setQueryData([InventoryAuditQueryKeys.INVENTORY_AUDIT, searchParams], context.previousData)
		}
	})
}
