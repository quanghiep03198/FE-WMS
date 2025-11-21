import {
	ITruckloadDelivery,
	TruckloadDeliveryDispatchOrder,
	TruckloadDeliveryService
} from '@/services/truckload-delivery.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TruckloadDeliveryStatus } from '../-constants'
import { UpdateDeliveryFormValues, UpdateDispatchOrderFormValues, UpsertPurchaseOrdersFormValues } from '../-schemas'

export enum TruckloadDeliveryQueryKeys {
	TRUCKLOAD_DELIVERY = 'TRUCKLOAD_DELIVERY',
	UPSERT_PURCHASE_ORDERS = 'UPSERT_PURCHASE_ORDERS',
	DELETE_PURCHASE_ORDER = 'DELETE_PURCHASE_ORDER'
}

export const useGetTruckloadDeliveryQuery = () => {
	return useQuery({
		queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY],
		queryFn: TruckloadDeliveryService.getAll,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: (response) => {
			return Array.isArray(response.metadata)
				? response.metadata.map((item) => ({
						...item,
						purchase_orders: item.delivery_details.map(({ po }) => po),
						total_outbound_qty: item.delivery_details.reduce((sum, detail) => sum + (detail.outbound_qty || 0), 0)
					}))
				: []
		}
	})
}

export const useCreateTruckloadDeliveryMutation = () => {
	const invalidateQueries = useInvalidateDeliveryQueries()

	return useMutation({
		mutationFn: TruckloadDeliveryService.insertMany,
		onSuccess: () => invalidateQueries('all')
	})
}

export const useUpdateDispatchOrderMutation = () => {
	const invalidateQueries = useInvalidateDeliveryQueries()

	return useMutation({
		mutationFn: ({ dispatch_order, ...update }: UpdateDispatchOrderFormValues) => {
			return TruckloadDeliveryService.bulkUpdate(dispatch_order, update)
		},
		onSuccess: () => invalidateQueries('all')
	})
}

export const useUpdateTruckloadDeliveryMutation = () => {
	const invalidateQueries = useInvalidateDeliveryQueries()

	return useMutation({
		mutationFn: ({ id, ...update }: UpdateDeliveryFormValues) => {
			return TruckloadDeliveryService.updateOneById(id, update)
		},
		onSuccess: () => invalidateQueries('all')
	})
}

export const useDeleteTruckloadDeliveryMutation = () => {
	const invalidateQueries = useInvalidateDeliveryQueries()

	return useMutation({
		mutationKey: [TruckloadDeliveryQueryKeys.DELETE_PURCHASE_ORDER],
		mutationFn: (id: number) => {
			return TruckloadDeliveryService.deleteOne(id)
		},
		onSuccess: () => invalidateQueries('all')
	})
}

export const useDeleteDispatchOrdersMutation = () => {
	const invalidateQueries = useInvalidateDeliveryQueries()

	return useMutation({
		mutationFn: (dispatchOrder: TruckloadDeliveryDispatchOrder) => {
			return TruckloadDeliveryService.bulkDelete(dispatchOrder)
		},
		onSuccess: () => invalidateQueries('all')
	})
}

export const useUpsertPurchaseOrdersMutation = () => {
	const invalidateQueries = useInvalidateDeliveryQueries()
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: [TruckloadDeliveryQueryKeys.UPSERT_PURCHASE_ORDERS],
		mutationFn: (payload: UpsertPurchaseOrdersFormValues) => TruckloadDeliveryService.upsertPurchaseOrders(payload),
		onMutate: async () => {
			queryClient.cancelQueries({
				queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY],
				predicate: (query) => query.queryKey.some((key) => Object.values(TruckloadDeliveryQueryKeys).includes(key)),
				type: 'all'
			})
		},
		onSuccess: () => invalidateQueries('all')
	})
}

export const useSetTruckloadDeliveryStatusMutation = () => {
	const invalidateQueries = useInvalidateDeliveryQueries()

	return useMutation({
		mutationFn: ({
			dispatchOrder,
			status
		}: {
			dispatchOrder: TruckloadDeliveryDispatchOrder
			status: TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE
		}) => TruckloadDeliveryService.setStatusById(dispatchOrder, status),
		onSuccess: () => invalidateQueries('all')
	})
}

export const useInvalidateDeliveryQueries = () => {
	const queryClient = useQueryClient()

	return (refetchType: 'none' | 'all' = 'all') => {
		if (refetchType === 'none')
			queryClient.setQueryData(
				[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY],
				(oldData: ResponseBody<ITruckloadDelivery[]>) => {
					return {
						...oldData,
						metadata: oldData.metadata.map((item) => ({
							...item,
							delivery_details: item.delivery_details.filter((item) => typeof item.id === 'number')
						}))
					}
				}
			)
		queryClient.invalidateQueries({
			queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY],
			predicate: (query) => query.queryKey.some((key) => Object.values(TruckloadDeliveryQueryKeys).includes(key)),
			refetchType: refetchType
		})
	}
}
