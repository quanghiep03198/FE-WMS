import { PackingService } from '@features/packing-manifest/services/packing.service'
import { toManifestFilters } from '@features/packing-manifest/utils/manifest-query'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnFiltersState, PaginationState, SortingState, Updater } from '@tanstack/react-table'
import { functionalUpdate } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function usePackingManifestList() {
	const { t } = useTranslation()
	const queryClient = useQueryClient()
	const [pagination, setPagination] = useState({ page: 1, pageSize: 20 })
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const filters = useMemo(() => toManifestFilters(columnFilters, sorting), [columnFilters, sorting])
	const params = useMemo(() => ({ ...filters, ...pagination }), [filters, pagination])
	const query = useQuery({
		queryKey: ['PACKING_MANIFEST', params],
		queryFn: () => PackingService.getPackingManifestPage(params),
		placeholderData: keepPreviousData,
		staleTime: 10_000
	})
	useEffect(() => {
		if (!query.data || query.isPlaceholderData || query.data.page !== params.page) return
		if (params.page * params.pageSize >= query.data.total) return
		const nextParams = { ...params, page: params.page + 1 }
		void queryClient.fetchQuery({
			queryKey: ['PACKING_MANIFEST', nextParams],
			queryFn: () => PackingService.getPackingManifestPage(nextParams),
			staleTime: 10_000
		}).catch((error: unknown) => console.warn('Packing manifest prefetch failed:', error))
	}, [params, query.data, query.isPlaceholderData, queryClient])
	const update = useMutation({
		mutationFn: (payload: { po: string; size: string; actual_weight_in: number }) =>
			PackingService.bulkUpdatePacking(payload),
		onError: () => toast.error(t('ns_common:notification.error')),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['PACKING_MANIFEST'] })
	})

	const onPaginationChange = (update: Updater<PaginationState>) => {
		setPagination((previous) => {
			const next =
				typeof update === 'function'
					? functionalUpdate(update, { pageIndex: previous.page - 1, pageSize: previous.pageSize })
					: { pageIndex: update.pageIndex - 1, pageSize: update.pageSize }
			return { ...previous, page: Math.max(1, next.pageIndex + 1) }
		})
	}
	const onSortingChange = (update: Updater<SortingState>) => {
		setSorting((previous) => functionalUpdate(update, previous).slice(0, 1))
		setPagination((previous) => ({ ...previous, page: 1 }))
	}
	const onColumnFiltersChange = (update: Updater<ColumnFiltersState>) => {
		setColumnFilters((previous) => functionalUpdate(update, previous))
		setPagination((previous) => ({ ...previous, page: 1 }))
	}

	return {
		data: query.data,
		isLoading: query.isLoading,
		isError: query.isError,
		isPlaceholderData: query.isPlaceholderData,
		refetch: query.refetch,
		updateWeight: update.mutate,
		isUpdatingWeight: update.isPending,
		isUpdateError: update.isError,
		pagination,
		sorting,
		columnFilters,
		filters,
		onPaginationChange,
		onSortingChange,
		onColumnFiltersChange
	}
}
