import { RFIDService } from '@/services/rfid.service'
import { useQuery } from '@tanstack/react-query'

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
