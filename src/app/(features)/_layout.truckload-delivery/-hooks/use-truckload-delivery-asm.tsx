import {
	ITruckloadDelivery,
	TruckloadDeliveryDispatchOrder,
	TruckloadDeliveryService
} from '@/services/truckload-delivery.service'
import { keepPreviousData, queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { uniqBy } from 'lodash-es'
import { TruckloadDeliveryStatus } from '../-constants'
import { SignatureType } from '../-contexts/page-context'
import { UpdateDispatchOrderFormValues, UpsertPurchaseOrdersFormValues } from '../-schemas'
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

export type TruckloadDeliveryQueryData = ITruckloadDelivery & { purchase_orders: string[]; total_outbound_qty: number }

export const getTruckloadDeliveryQueryOptions = (searchParams) =>
	queryOptions({
		queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY, searchParams],
		queryFn: async () => await TruckloadDeliveryService.getDispatchOrders(searchParams),
		refetchOnWindowFocus: true,
		refetchOnReconnect: true,
		staleTime: 5000,
		enabled: typeof searchParams.page === 'number' && typeof searchParams.limit === 'number',
		placeholderData: keepPreviousData,
		select: (response) => {
			const data: TruckloadDeliveryQueryData[] = Array.isArray(response.metadata.data)
				? response.metadata.data.map((item) => ({
						...item,
						purchase_orders: item.delivery_details.map(({ po }) => po),
						total_outbound_qty: uniqBy(item.delivery_details, 'po').reduce(
							(sum, detail) => sum + (detail.outbound_qty || 0),
							0
						)
					}))
				: []
			return {
				...response.metadata,
				data
			}
		}
	})

export const useGetTruckloadDeliveryQuery = () => {
	const { searchParams } = usePageQueryParams()
	const queryOptions = getTruckloadDeliveryQueryOptions(searchParams)
	return useQuery(queryOptions)
}

export const useSearchDispatchPurchaseOrder = (search: string) => {
	return useQuery({
		queryKey: [TruckloadDeliveryQueryKeys.DISPATCH_PURCHASE_ORDER, search],
		queryFn: async () => await TruckloadDeliveryService.searchDispatchPurchaseOrder(search),
		staleTime: 5000,
		select: (response) => {
			return Array.isArray(response.metadata)
				? response.metadata.map((po) => ({ ...po, max_outbound_qty: Math.abs(po.max_outbound_qty) }))
				: []
		}
	})
}

export const useCreateTruckloadDeliveryMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: TruckloadDeliveryService.insertMany,
		onSuccess: () => invalidateQueries()
	})
}

export const useUpdateDispatchOrderMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: ({ dispatch_order, ...update }: UpdateDispatchOrderFormValues) => {
			return TruckloadDeliveryService.bulkUpdate(dispatch_order, update)
		},
		onSuccess: () => invalidateQueries()
	})
}

export const useDeleteTruckloadDeliveryMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationKey: [TruckloadDeliveryMutationKeys.DELETE_PURCHASE_ORDER],
		mutationFn: (id: number) => {
			return TruckloadDeliveryService.deleteOne(id)
		},
		onSuccess: () => invalidateQueries()
	})
}

export const useDeleteDispatchOrdersMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: (dispatchOrder: TruckloadDeliveryDispatchOrder) => {
			return TruckloadDeliveryService.bulkDelete(dispatchOrder)
		},
		onSuccess: () => invalidateQueries()
	})
}

export const useUpsertPurchaseOrdersMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationKey: [TruckloadDeliveryMutationKeys.UPSERT_PURCHASE_ORDERS],
		mutationFn: (payload: UpsertPurchaseOrdersFormValues) => TruckloadDeliveryService.upsertPurchaseOrders(payload),
		onSuccess: () => invalidateQueries()
	})
}

export const useUpdateDispatchOrderSignatureMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: (payload: {
			dispatch_order: TruckloadDeliveryDispatchOrder
			signature_type: SignatureType
			approval_status: TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE
			signature: string
		}) => TruckloadDeliveryService.updateDispatchOrderSignature(payload),
		onSuccess: () => invalidateQueries()
	})
}

export const useUpdateContainerConditionMutation = () => {
	const invalidateQueries = useInvalidateQueries()
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: [TruckloadDeliveryMutationKeys.UPDATE_CONTAINER_STATUS],
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
		},
		onSettled: invalidateQueries
	})
}

const useInvalidateQueries = () => {
	const queryClient = useQueryClient()

	return () => {
		queryClient.invalidateQueries({
			queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY],
			predicate: (query) => query.queryKey.some((key) => Object.values(TruckloadDeliveryQueryKeys).includes(key)),
			refetchType: 'active'
		})
	}
}
