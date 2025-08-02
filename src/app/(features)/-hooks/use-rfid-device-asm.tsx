import { RFIDService } from '@/services/rfid.service'
import { useQuery } from '@tanstack/react-query'

export enum RFIDDeviceQueryKeys {
	WAREHOUSE_RFID_DEVICES = 'WAREHOUSE_RFID_DEVICES'
}

export const useGetRFIDDevices = () => {
	return useQuery({
		queryKey: [RFIDDeviceQueryKeys.WAREHOUSE_RFID_DEVICES],
		queryFn: () => RFIDService.getWarehouseRFIDDevices(),
		select: (response) => response.metadata
	})
}
