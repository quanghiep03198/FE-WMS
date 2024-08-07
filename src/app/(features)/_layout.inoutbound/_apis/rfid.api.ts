import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useUnmount } from 'ahooks'
import { useEffect, useRef } from 'react'
import { ScanningStatus } from '../_contexts/-page-context'

export const RFID_EPC_PROVIDE_TAG = 'RFID_EPC'
export const DATABASE_COMPATIBILITY_PROVIDE_TAG = 'DATABASE_COMPATIBILITY'
export const INOUTBOUND_DEPT_PROVIDE_TAG = 'INOUTBOUND_DEPT'
export const UNKNOWN_ORDER = 'Unknown'

export const useGetScannedEPC = (params: { connection: string; scanningStatus: ScanningStatus }) => {
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
