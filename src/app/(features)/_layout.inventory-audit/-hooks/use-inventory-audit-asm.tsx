import useQueryParams from '@/hooks/use-query-params'
import { InventoryService } from '@/services/inventory.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { InventoryAuditFormValues } from '../-schemas/inventory-audit.schema'
import type { BaseUpdateUpdateQuery } from '../-types'

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

export const useInventoryAuditMutation = (
	queries: Omit<BaseUpdateUpdateQuery, 'size_numcode'>,
	signal: AbortSignal
) => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()
	const { searchParams } = useQueryParams<{ 'month:eq': string }>({ 'month:eq': format(new Date(), 'yyyy-MM') })

	return useMutation({
		mutationFn: async (payload: InventoryAuditFormValues['data']) => {
			return await InventoryService.updateInventoryAuditReport(
				signal,
				{ ...queries, po: queries.actual_po, inv_year_month: searchParams['month:eq'] },
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
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				predicate: ({ queryKey }) => {
					return queryKey.some((key) => key === InventoryAuditQueryKeys.INVENTORY_AUDIT)
				}
			})
		}
	})
}
