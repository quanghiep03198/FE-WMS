import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useUnmount } from 'ahooks'
import { useEffect, useRef } from 'react'
import { ScanningStatus } from '../_contexts/-page-context'

export const RFID_EPC_PROVIDE_TAG = 'RFID_EPC'
export const DATABASE_COMPATIBILITY_PROVIDE_TAG = 'DATABASE_COMPATIBILITY'
export const INOUTBOUND_DEPT_PROVIDE_TAG = 'INOUTBOUND_DEPT'
export const UNKNOWN_ORDER = 'Unknown'

export const useGetScannedEPCQuery = (params: { connection: string; scanningStatus: ScanningStatus }) => {
	const controllerRef = useRef(new AbortController())

	useEffect(() => {
		// Cancel current request if user stop scanning
		if (params.scanningStatus !== 'scanning') controllerRef.current.abort()
		else controllerRef.current = new AbortController()
	}, [params.scanningStatus])

	useUnmount(() => {
		controllerRef.current.abort() // Cancel current request if user wish to leave the page
	})

	return useQuery({
		queryKey: [RFID_EPC_PROVIDE_TAG, params.connection],
		queryFn: async () => await RFIDService.getScannedEPC(params.connection, { signal: controllerRef.current.signal }),
		enabled: params.scanningStatus === 'scanning',
		refetchInterval: 5000, // refetch every 5 seconds
		select: (response) => response.metadata
	})
}

export const useUpdateEPCMutation = () => {
	return useMutation({
		mutationKey: [RFID_EPC_PROVIDE_TAG],
		mutationFn: RFIDService.updateStockMovement
	})
}

export const useSynchronizeOrderCodeMutation = () => {
	return useMutation({
		mutationKey: [RFID_EPC_PROVIDE_TAG],
		mutationFn: RFIDService.synchronizeOrderCode
	})
}

export const useGetInoutboundDeptQuery = () => {
	return useQuery({
		queryKey: [INOUTBOUND_DEPT_PROVIDE_TAG],
		queryFn: RFIDService.getInoutboundDept,
		select: (response) => response.metadata
	})
}
