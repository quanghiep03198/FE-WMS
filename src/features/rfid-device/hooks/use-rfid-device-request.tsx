import { RFIDDeviceService } from '@features/rfid-device/services/rfid-device.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateRFIDReaderFormValues, UpdateRFIDReaderFormValues } from '../schemas/rfid-device.schema'

enum RFIDDeviceQueryKeys {
	WAREHOUSE_RFID_DEVICES = 'WAREHOUSE_RFID_DEVICES'
}

export const useGetRFIDDeviceQuery = () => {
	return useQuery({
		queryKey: [RFIDDeviceQueryKeys.WAREHOUSE_RFID_DEVICES],
		queryFn: () => RFIDDeviceService.getWarehouseRFIDDevices(),
		select: (response) => response.metadata
	})
}

export const useCreateRFIDDeviceMutation = () => {
	const invalidateQuery = useInvalidateQuery()

	return useMutation({
		mutationKey: [RFIDDeviceQueryKeys.WAREHOUSE_RFID_DEVICES],
		mutationFn: (data: CreateRFIDReaderFormValues) => RFIDDeviceService.createWarehouseRFIDDevice(data),
		onSuccess: () => invalidateQuery()
	})
}

export const useUpdateRFIDDeviceMutation = () => {
	const invalidateQuery = useInvalidateQuery()

	return useMutation({
		mutationKey: [RFIDDeviceQueryKeys.WAREHOUSE_RFID_DEVICES],
		mutationFn: (data: UpdateRFIDReaderFormValues) => RFIDDeviceService.updateWarehouseRFIDDevice(data),
		onSuccess: () => invalidateQuery()
	})
}

export const useDeleteRFIDDeviceMutation = () => {
	const invalidateQuery = useInvalidateQuery()

	return useMutation({
		mutationKey: [RFIDDeviceQueryKeys.WAREHOUSE_RFID_DEVICES],
		mutationFn: (deviceSeriesNumbers: string[]) => RFIDDeviceService.deleteWarehouseRFIDDevice(deviceSeriesNumbers),
		onSuccess: () => invalidateQuery()
	})
}

export const useInvalidateQuery = () => {
	const queryClient = useQueryClient()
	return () => queryClient.invalidateQueries({ queryKey: [RFIDDeviceQueryKeys.WAREHOUSE_RFID_DEVICES], exact: true })
}
