import type {
	ITruckloadDelivery,
	ITruckloadDeliveryDetail,
	TruckloadDeliveryDispatchOrder
} from '@/services/truckload-delivery.service'
import { TruckloadDeliveryService } from '@/services/truckload-delivery.service'
import { keepPreviousData, queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { TruckloadDeliveryStatus } from '../-constants'
import type { SignatureType } from '../-contexts/page-context'
import type { UpdateDispatchOrderFormValues, UpsertPurchaseOrdersFormValues } from '../-schemas'
import { usePageQueryParams } from './use-page-query-params'

export enum TruckloadDeliveryQueryKeys {
	TRUCKLOAD_DELIVERY = 'TRUCKLOAD_DELIVERY',
	TRUCKLOAD_DELIVERY_DETAIL = 'TRUCKLOAD_DELIVERY_DETAIL',
	DISPATCH_PURCHASE_ORDER = 'DISPATCH_PURCHASE_ORDER'
}

export enum TruckloadDeliveryMutationKeys {
	UPDATE_CONTAINER_STATUS = 'UPDATE_CONTAINER_STATUS',
	DELETE_PURCHASE_ORDER = 'DELETE_PURCHASE_ORDER',
	UPSERT_PURCHASE_ORDERS = 'UPSERT_PURCHASE_ORDERS'
}

export const getTruckloadDeliveryQueryOptions = (searchParams) =>
	queryOptions({
		queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY, searchParams],
		queryFn: async () => await TruckloadDeliveryService.getDispatchOrders(searchParams),
		refetchOnMount: true,
		refetchOnReconnect: true,
		staleTime: 5000,
		enabled: typeof searchParams.page === 'number' && typeof searchParams.limit === 'number',
		placeholderData: keepPreviousData,
		select: (response) => {
			const data: ITruckloadDelivery[] = Array.isArray(response.metadata.data) ? response.metadata.data : []
			return {
				...response.metadata,
				data
			}
		}
	})

export const getTruckloadDeliveryDetailQueryOptions = (dispatchOrder: string) => {
	return queryOptions({
		queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY_DETAIL, dispatchOrder],
		queryFn: async () => await TruckloadDeliveryService.getDispatchOrderDetail(dispatchOrder),
		select: (response) =>
			Array.isArray(response.metadata) ? response.metadata.map((item) => ({ ...item, keyid: item.id })) : []
	})
}

export const useGetTruckloadDeliveryQuery = () => {
	const { searchParams } = usePageQueryParams()
	const queryOptions = useMemo(() => getTruckloadDeliveryQueryOptions(searchParams), [searchParams])
	return useQuery(queryOptions)
}

export const useSearchDispatchPurchaseOrder = (search: string) => {
	return useQuery({
		queryKey: [TruckloadDeliveryQueryKeys.DISPATCH_PURCHASE_ORDER, search],
		queryFn: async () => await TruckloadDeliveryService.searchDispatchPurchaseOrder(search),
		staleTime: 0,
		select: (response) => {
			return Array.isArray(response.metadata) ? response.metadata : []
		}
	})
}

export const useCreateTruckloadDeliveryMutation = () => {
	const { searchParams } = usePageQueryParams()

	return useMutation({
		meta: { invalidates: [[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY, searchParams]] },
		mutationFn: TruckloadDeliveryService.insertMany
	})
}

export const useUpdateDispatchOrderMutation = () => {
	const { searchParams } = usePageQueryParams()

	return useMutation({
		meta: { invalidates: [[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY, searchParams]] },
		mutationFn: ({ dispatch_order, ...update }: UpdateDispatchOrderFormValues) => {
			return TruckloadDeliveryService.bulkUpdate(dispatch_order, update)
		}
	})
}

export const useDeleteTruckloadDeliveryMutation = () => {
	const { searchParams } = usePageQueryParams()

	return useMutation({
		meta: { invalidates: [[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY, searchParams]] },
		mutationFn: (id: number) => {
			return TruckloadDeliveryService.deleteOne(id)
		}
	})
}

export const useDeleteDispatchOrdersMutation = () => {
	const { searchParams } = usePageQueryParams()

	return useMutation({
		meta: { invalidates: [[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY, searchParams]] },
		mutationFn: (dispatchOrder: TruckloadDeliveryDispatchOrder) => {
			return TruckloadDeliveryService.bulkDelete(dispatchOrder)
		}
	})
}

export const useUpsertPurchaseOrdersMutation = (dispatchOrder: string) => {
	// const invalidateQueries = useInvalidateQueries(dispatchOrder)
	const queryClient = useQueryClient()
	const { searchParams } = usePageQueryParams()

	return useMutation({
		meta: {
			invalidates: [
				[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY, searchParams],
				[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY_DETAIL, dispatchOrder]
			]
		},
		mutationFn: (payload: UpsertPurchaseOrdersFormValues) => TruckloadDeliveryService.upsertPurchaseOrders(payload),
		onMutate: async (variables) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY] })

			// Snapshot the previous value
			const prevMasterData = queryClient.getQueryData<ResponseBody<Pagination<ITruckloadDelivery>>>([
				TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY,
				searchParams
			])

			const prevDetailData = queryClient.getQueryData<ResponseBody<ITruckloadDeliveryDetail[]>>([
				TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY_DETAIL,
				dispatchOrder
			])

			// Optimistically update to the new value
			queryClient.setQueryData<ResponseBody<Pagination<ITruckloadDelivery>>>(
				[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY, searchParams],
				(oldData) => {
					if (!oldData) return oldData
					return {
						...oldData,
						metadata: {
							...oldData.metadata,
							data: !Array.isArray(oldData?.metadata?.data)
								? []
								: oldData?.metadata?.data?.map((item) => {
										if (item.dispatch_order === variables.dispatch_order)
											return {
												...item,
												total_outbound_qty: variables.outbound_purchase_orders.reduce(
													(acc, curr) => acc + curr.outbound_qty,
													0
												)
											}
										return item
									})
						}
					}
				}
			)

			queryClient.setQueryData<ResponseBody<ITruckloadDeliveryDetail[]>>(
				[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY_DETAIL, dispatchOrder],
				(oldData) => ({
					...oldData,
					metadata: oldData.metadata.map((item) => {
						const matched = variables.outbound_purchase_orders.find((order) => order.po === item.po)
						if (matched)
							return {
								...item,
								outbound_qty: matched.outbound_qty,
								max_outbound_qty: item.po_qty - matched.outbound_qty
							}
						return item
					})
				})
			)
			// Return a context object with the snapshotted value
			return { prevMasterData, prevDetailData }
		},
		onError: (_error, _variables, context) => {
			if (context && context.prevMasterData) {
				queryClient.setQueryData<ResponseBody<Pagination<ITruckloadDelivery>>>(
					[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY],
					context.prevMasterData
				)

				queryClient.setQueryData<ResponseBody<ITruckloadDeliveryDetail[]>>(
					[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY_DETAIL, dispatchOrder],
					context.prevDetailData
				)
			}
		}
	})
}

export const useUpdateDispatchOrderSignatureMutation = (dispatchOrder: string | null) => {
	const { searchParams } = usePageQueryParams()

	return useMutation({
		meta: {
			invalidates: [
				[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY, searchParams],
				[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY_DETAIL, dispatchOrder]
			]
		},
		mutationFn: (payload: {
			dispatch_order: TruckloadDeliveryDispatchOrder
			signature_type: SignatureType
			approval_status: TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE
			signature: string
		}) => TruckloadDeliveryService.updateDispatchOrderSignature(payload)
	})
}

export const useUpdateContainerConditionMutation = () => {
	const queryClient = useQueryClient()
	const { searchParams } = usePageQueryParams()

	return useMutation({
		meta: { invalidates: [[TruckloadDeliveryService, searchParams]] },
		mutationFn: async (payload: {
			dispatch_order: TruckloadDeliveryDispatchOrder
			punctured_container?: boolean
			smelling_container?: boolean
			moist_container?: boolean
		}) => {
			return await TruckloadDeliveryService.updateContainerCondition(payload)
		},
		onMutate: async (variables) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY] })

			// Snapshot the previous value
			const previousData = queryClient.getQueryData<ResponseBody<ITruckloadDelivery[]>>([
				TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY
			])

			// Optimistically update to the new value
			queryClient.setQueryData<ResponseBody<ITruckloadDelivery[]>>(
				[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY],
				(oldData) => {
					if (!oldData) return oldData
					return {
						...oldData,
						metadata: oldData.metadata.map((item) => {
							if (item.dispatch_order === variables.dispatch_order) return { ...item, ...variables }
							return item
						})
					}
				}
			)
			return { previousData }
		},
		onError: (_error, _variables, context) => {
			if (context && context.previousData) {
				queryClient.setQueryData<ResponseBody<ITruckloadDelivery[]>>(
					[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY],
					context.previousData
				)
			}
		}
	})
}
