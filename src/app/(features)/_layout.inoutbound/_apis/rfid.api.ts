import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ScanningStatus } from '../_contexts/-page-context'

export const RFID_EPC_PROVIDE_TAG = 'RFID_EPC' as const
export const DATABASE_COMPATIBILITY_PROVIDE_TAG = 'DATABASE_COMPATIBILITY' as const
export const INOUTBOUND_DEPT_PROVIDE_TAG = 'INOUTBOUND_DEPT' as const

export const UNKNOWN_ORDER = 'Unknown' as const

export const useGetScannedEPC = (params: { connection: string; scanningStatus: ScanningStatus }) => {
	return useQuery({
		queryKey: [RFID_EPC_PROVIDE_TAG, params.connection],
		queryFn: () => RFIDService.getScannedEPC(params.connection),
		enabled: params.scanningStatus === 'scanning',
		refetchInterval: 5000, // refetch every 5 seconds
		select: (response) => {
			const datalist = response.metadata?.datalist
			return {
				...response.metadata,
				datalist: Array.isArray(datalist)
					? datalist.map((item) => ({ ...item, mo_no: item.mo_no ?? UNKNOWN_ORDER }))
					: []
			}
		}
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
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})
}

export const useGetInoutboundDept = () => {
	return useQuery({
		queryKey: [INOUTBOUND_DEPT_PROVIDE_TAG],
		queryFn: RFIDService.getInoutboundDept,
		select: (response) => response.metadata
	})
}
