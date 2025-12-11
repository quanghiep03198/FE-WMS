import { TruckloadDeliveryDispatchOrder, TruckloadDeliveryService } from '@/services/truckload-delivery.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { uniqBy } from 'lodash-es'
import { TruckloadDeliveryStatus } from '../-constants'
import { UpdateDispatchOrderFormValues, UpsertPurchaseOrdersFormValues } from '../-schemas'

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
						total_outbound_qty: uniqBy(item.delivery_details, 'po').reduce(
							(sum, detail) => sum + (detail.outbound_qty || 0),
							0
						)
					}))
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
		mutationKey: [TruckloadDeliveryQueryKeys.DELETE_PURCHASE_ORDER],
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
		mutationKey: [TruckloadDeliveryQueryKeys.UPSERT_PURCHASE_ORDERS],
		mutationFn: (payload: UpsertPurchaseOrdersFormValues) => TruckloadDeliveryService.upsertPurchaseOrders(payload),
		onSuccess: () => invalidateQueries()
	})
}

export const useUpdateDispatchOrderSignatureMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: (payload: {
			dispatch_order: TruckloadDeliveryDispatchOrder
			signature_type: 'ie_signature' | 'warehouse_officer_signature' | 'security_guard_signature'
			approval_status: TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE
			signature: string
		}) => TruckloadDeliveryService.updateDispatchOrderSignature(payload),
		onSuccess: () => invalidateQueries()
	})
}

export const useUpdateContainerConditionMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: async (payload: {
			dispatch_order: TruckloadDeliveryDispatchOrder
			punctured_container?: boolean
			smelling_container?: boolean
			moist_container?: boolean
		}) => {
			return await TruckloadDeliveryService.updateContainerCondition(payload)
		},
		onSuccess: invalidateQueries
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
