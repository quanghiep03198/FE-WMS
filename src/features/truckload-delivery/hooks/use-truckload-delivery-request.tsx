import { TruckloadDeliveryService } from '@features/truckload-delivery/services/truckload-delivery.service'
import useAuth from '@hooks/use-auth'
import { keepPreviousData, queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { uniqBy } from 'lodash-es'
import { useMemo } from 'react'
import type { UpdateDispatchOrderFormValues, UpsertPurchaseOrdersFormValues } from '../schemas'
import type { ITruckloadDelivery, ITruckloadDeliveryPacking, TruckloadDeliveryDispatchOrder } from '../types'
import type { PageQueryParams } from './use-page-query-params'
import { usePageQueryParams } from './use-page-query-params'

export enum TruckloadDeliveryQueryKeys {
	TRUCKLOAD_DELIVERY = 'TRUCKLOAD_DELIVERY',
	DISPATCH_PURCHASE_ORDER = 'DISPATCH_PURCHASE_ORDER'
}

export enum TruckloadDeliveryMutationKeys {
	UPDATE_CONTAINER_STATUS = 'UPDATE_CONTAINER_STATUS',
	DELETE_PURCHASE_ORDER = 'DELETE_PURCHASE_ORDER',
	UPSERT_PURCHASE_ORDERS = 'UPSERT_PURCHASE_ORDERS'
}

export const getTruckloadDeliveryQueryOptions = (searchParams: PageQueryParams) =>
	queryOptions({
		queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY, searchParams],
		queryFn: async () => await TruckloadDeliveryService.getDispatchOrders(searchParams),
		staleTime: 30_000,
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
		initialData: { metadata: [] } as unknown as ResponseBody<
			Pick<
				ITruckloadDeliveryPacking,
				'po' | 'brand_name' | 'factory_shoes_style' | 'color_sn' | 'max_outbound_qty'
			>[]
		>,
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

export const useDeleteTruckloadPurchaseOrderMutation = () => {
	const { searchParams } = usePageQueryParams()

	return useMutation({
		meta: { invalidates: [[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY, searchParams]] },
		mutationFn: (params: { dispatch_order: TruckloadDeliveryDispatchOrder; po: string }) => {
			return TruckloadDeliveryService.deleteOne(params)
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

export const useUpsertPurchaseOrdersMutation = () => {
	// const invalidateQueries = useInvalidateQueries(dispatchOrder)
	const { user } = useAuth()
	const queryClient = useQueryClient()
	const { searchParams } = usePageQueryParams()

	return useMutation({
		meta: { invalidates: [[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY, searchParams]] },
		mutationFn: (payload: UpsertPurchaseOrdersFormValues) => TruckloadDeliveryService.upsertPurchaseOrders(payload),
		onMutate: async (variables) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY] })

			// Snapshot the previous value
			const prevMasterData = queryClient.getQueryData<ResponseBody<Pagination<ITruckloadDelivery>>>([
				TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY,
				searchParams
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
												),
												packing: uniqBy(
													[
														...item.packing,
														...variables.outbound_purchase_orders.map((item) => ({
															...item,
															created_by: user,
															created_at: format(new Date(), 'yyyy-MM-dd HH:mm')
														}))
													],
													'po'
												)
											}
										return item
									})
						}
					} as ResponseBody<Pagination<ITruckloadDelivery>>
				}
			)

			// Return a context object with the snapshotted value
			return { prevMasterData }
		},
		onError: (_error, _variables, context) => {
			if (context && context.prevMasterData) {
				queryClient.setQueryData<ResponseBody<Pagination<ITruckloadDelivery>>>(
					[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY],
					context.prevMasterData
				)
			}
		}
	})
}

export const useUpdateDispatchOrderSignatureMutation = () => {
	const { searchParams } = usePageQueryParams()

	return useMutation({
		meta: { invalidates: [[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY, searchParams]] },
		mutationFn: TruckloadDeliveryService.updateDispatchOrderSignature
	})
}

export const useUpdateContainerConditionMutation = () => {
	const queryClient = useQueryClient()
	const { searchParams } = usePageQueryParams()

	return useMutation({
		meta: {
			invalidates: [[TruckloadDeliveryService, searchParams]]
		},
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

			// Return a context object with the snapshotted value
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
