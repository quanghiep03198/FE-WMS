import { RFIDService } from '@/services/rfid.service'
import { useQuery } from '@tanstack/react-query'

export const useGetRFIDDevices = () => {
	return useQuery({
		queryKey: ['WAREHOUSE_RFID_DEVICES'],
		queryFn: () => RFIDService.getWarehouseRFIDDevices(),
		select: (response) => response.metadata
	})
}
