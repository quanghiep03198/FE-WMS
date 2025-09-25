import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreateRFIDReaderFormValues, UpdateRFIDReaderFormValues } from '../-schemas/rfid-reader.schema'

enum RFIDDeviceQueryKeys {
	WAREHOUSE_RFID_DEVICES = 'WAREHOUSE_RFID_DEVICES'
}

export const useGetRFIDDeviceQuery = () => {
	return useQuery({
		queryKey: [RFIDDeviceQueryKeys.WAREHOUSE_RFID_DEVICES],
		queryFn: () => RFIDService.getWarehouseRFIDDevices(),
		refetchInterval: 5000,
		select: (response) => response.metadata
	})
}

export const useCreateRFIDDeviceMutation = () => {
	const invalidateQuery = useInvalidateQuery()

	return useMutation({
		mutationKey: [RFIDDeviceQueryKeys.WAREHOUSE_RFID_DEVICES],
		mutationFn: (data: CreateRFIDReaderFormValues) => RFIDService.createWarehouseRFIDDevice(data),
		onSuccess: () => invalidateQuery()
	})
}

export const useUpdateRFIDDeviceMutation = () => {
	const invalidateQuery = useInvalidateQuery()

	return useMutation({
		mutationKey: [RFIDDeviceQueryKeys.WAREHOUSE_RFID_DEVICES],
		mutationFn: (data: UpdateRFIDReaderFormValues) => RFIDService.updateWarehouseRFIDDevice(data),
		onSuccess: () => invalidateQuery()
	})
}

export const useDeleteRFIDDeviceMutation = () => {
	const invalidateQuery = useInvalidateQuery()

	return useMutation({
		mutationKey: [RFIDDeviceQueryKeys.WAREHOUSE_RFID_DEVICES],
		mutationFn: (deviceSeriesNumbers: string[]) => RFIDService.deleteWarehouseRFIDDevice(deviceSeriesNumbers),
		onSuccess: () => invalidateQuery()
	})
}

export const useInvalidateQuery = () => {
	const queryClient = useQueryClient()
	return () => queryClient.invalidateQueries({ queryKey: [RFIDDeviceQueryKeys.WAREHOUSE_RFID_DEVICES], exact: true })
}
