import { RFIDService } from '@/services/rfid.service'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { ScanningStatus } from '../_contexts/-page.context'

export const RFID_EPC_PROVIDE_TAG = 'RFID_EPC' as const
export const DATABASE_COMPATIBILITY_PROVIDE_TAG = 'DATABASE_COMPATIBILITY' as const

export const useGetUnscannedEPC = (params: { connection: string; scanningStatus: ScanningStatus }) => {
	return useQuery({
		queryKey: [RFID_EPC_PROVIDE_TAG],
		queryFn: () => RFIDService.getUnscannedEpc(params.connection),
		enabled: params.scanningStatus === 'scanning',
		refetchInterval: 5000, // refetch every 5 seconds
		placeholderData: keepPreviousData,
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})
}

export const useStoreEpcMutation = () => {
	return useMutation({
		mutationKey: [RFID_EPC_PROVIDE_TAG],
		mutationFn: RFIDService.updateStockMovement
	})
}

export const useSyncEpcOrderCodeMutation = () => {
	return useMutation({
		mutationKey: [RFID_EPC_PROVIDE_TAG],
		mutationFn: RFIDService.syncEpcOrderCode
	})
}

export const useGetDatabaseConnnection = () => {
	return useQuery({
		queryKey: [DATABASE_COMPATIBILITY_PROVIDE_TAG],
		queryFn: RFIDService.getDatabaseCompatibility,
		select: (response) => response.metadata
	})
}
