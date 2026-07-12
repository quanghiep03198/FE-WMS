import { FinishedGoodsInboundService } from '@/features/finished-goods/services/finished-goods-inbound.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateRFIDReaderFormValues, UpdateRFIDReaderFormValues } from '../-schemas/rfid-device.schema'

enum RFIDDeviceQueryKeys {
	WAREHOUSE_RFID_DEVICES = 'WAREHOUSE_RFID_DEVICES'
}

export const useGetRFIDDeviceQuery = () => {
	return useQuery({
		queryKey: [RFIDDeviceQueryKeys.WAREHOUSE_RFID_DEVICES],
		queryFn: () => FinishedGoodsInboundService.getWarehouseRFIDDevices(),
		select: (response) => response.metadata
	})
}

export const useCreateRFIDDeviceMutation = () => {
	const invalidateQuery = useInvalidateQuery()

	return useMutation({
		mutationKey: [RFIDDeviceQueryKeys.WAREHOUSE_RFID_DEVICES],
		mutationFn: (data: CreateRFIDReaderFormValues) => FinishedGoodsInboundService.createWarehouseRFIDDevice(data),
		onSuccess: () => invalidateQuery()
	})
}

export const useUpdateRFIDDeviceMutation = () => {
	const invalidateQuery = useInvalidateQuery()

	return useMutation({
		mutationKey: [RFIDDeviceQueryKeys.WAREHOUSE_RFID_DEVICES],
		mutationFn: (data: UpdateRFIDReaderFormValues) => FinishedGoodsInboundService.updateWarehouseRFIDDevice(data),
		onSuccess: () => invalidateQuery()
	})
}

export const useDeleteRFIDDeviceMutation = () => {
	const invalidateQuery = useInvalidateQuery()

	return useMutation({
		mutationKey: [RFIDDeviceQueryKeys.WAREHOUSE_RFID_DEVICES],
		mutationFn: (deviceSeriesNumbers: string[]) =>
			FinishedGoodsInboundService.deleteWarehouseRFIDDevice(deviceSeriesNumbers),
		onSuccess: () => invalidateQuery()
	})
}

export const useInvalidateQuery = () => {
	const queryClient = useQueryClient()
	return () => queryClient.invalidateQueries({ queryKey: [RFIDDeviceQueryKeys.WAREHOUSE_RFID_DEVICES], exact: true })
}
