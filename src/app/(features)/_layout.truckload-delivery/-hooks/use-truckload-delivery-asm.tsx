import { TruckloadDeliveryService } from '@/services/truckload-delivery.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { omit } from 'lodash'
import { UpdateDeliveryFormValues } from '../-schemas'

export enum TruckloadDeliveryQueryKeys {
	TRUCKLOAD_DELIVERY = 'TRUCKLOAD_DELIVERY'
}

export const useGetTruckloadDeliveryQuery = () => {
	return useQuery({
		queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY],
		queryFn: TruckloadDeliveryService.getAll,
		select: (response) => response.metadata ?? []
	})
}

export const useCreateTruckloadDeliveryMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: TruckloadDeliveryService.insertMany,
		onSuccess: invalidateQueries
	})
}

export const useUpdateTruckloadDeliveryMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: (payload: UpdateDeliveryFormValues) => {
			return TruckloadDeliveryService.updateOneById(payload.id, omit(payload, ['id', 'max_outbound_qty']))
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

const useInvalidateQueries = () => {
	const queryClient = useQueryClient()

	return () => {
		queryClient.invalidateQueries({
			queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY],
			predicate: (query) => query.queryKey.some((key) => Object.values(TruckloadDeliveryQueryKeys).includes(key))
		})
	}
}
