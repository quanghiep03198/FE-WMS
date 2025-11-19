import { TruckloadDeliveryDispatchOrder, TruckloadDeliveryService } from '@/services/truckload-delivery.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TruckloadDeliveryStatus } from '../-constants'
import { UpdateDeliveryFormValues, UpdateDispatchOrderFormValues, UpsertPurchaseOrdersFormValues } from '../-schemas'

export enum TruckloadDeliveryQueryKeys {
	TRUCKLOAD_DELIVERY = 'TRUCKLOAD_DELIVERY'
}

export const useGetTruckloadDeliveryQuery = () => {
	return useQuery({
		queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY],
		queryFn: TruckloadDeliveryService.getAll,
		select: (response) =>
			Array.isArray(response.metadata)
				? response.metadata.map((item) => ({ ...item, purchase_orders: item.delivery_details.map(({ po }) => po) }))
				: []
	})
}

export const useCreateTruckloadDeliveryMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: TruckloadDeliveryService.insertMany,
		onSuccess: invalidateQueries
	})
}

export const useUpdateDispatchOrderMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: ({ dispatch_order, ...update }: UpdateDispatchOrderFormValues) => {
			return TruckloadDeliveryService.bulkUpdate(dispatch_order, update)
		},
		onSuccess: invalidateQueries
	})
}

export const useUpdateTruckloadDeliveryMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: ({ id, ...update }: UpdateDeliveryFormValues) => {
			return TruckloadDeliveryService.updateOneById(id, update)
		},
		onSuccess: invalidateQueries
	})
}

export const useDeleteTruckloadDeliveryMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: ({ id, shouldPermanentlyDelete }: { id: number; shouldPermanentlyDelete?: true }) => {
			return TruckloadDeliveryService.deleteOne(id, shouldPermanentlyDelete)
		},
		onSuccess: invalidateQueries
	})
}

export const useUpsertPurchaseOrdersMutation = ()=>{
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: (payload: UpsertPurchaseOrdersFormValues)=> TruckloadDeliveryService.upsertPurchaseOrders(payload),
		onSuccess: invalidateQueries
	})
}

export const useSetTruckloadDeliveryStatusMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: ({
			dispatchOrder,
			status
		}: {
			dispatchOrder: TruckloadDeliveryDispatchOrder
			status: TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE
		}) => TruckloadDeliveryService.setStatusById(dispatchOrder, status),
		onSuccess: invalidateQueries
	})
}

const useInvalidateQueries = () => {
	const queryClient = useQueryClient()

	return () => {
		queryClient.invalidateQueries({
			queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY],
			predicate: (query) => query.queryKey.some((key) => Object.values(TruckloadDeliveryQueryKeys).includes(key))
		})
	}
}
