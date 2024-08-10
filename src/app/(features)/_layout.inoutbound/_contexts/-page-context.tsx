import { IElectronicProductCode } from '@/common/types/entities'
import { useQueryClient } from '@tanstack/react-query'
import { useMemoizedFn, useResetState, useUpdateEffect } from 'ahooks'
import React, { createContext, useContext, useMemo, useState } from 'react'
import { RFID_EPC_PROVIDE_TAG } from '../_apis/rfid.api'

export type ScanningStatus = 'scanning' | 'stopped' | 'finished' | undefined
export type ScannedOrder = { mo_no: string; count: number }
export type ScannedOrderSizing = ScannedOrder & { size_numcode: string }

type TPageContext = {
	scannedEPCs: Array<IElectronicProductCode>
	scannedOrders: Array<ScannedOrder>
	scannedOrderSizing: Array<ScannedOrderSizing>
	scanningStatus: ScanningStatus
	connection: string
	selectedOrder: string | null
	setScannedEPCs: React.Dispatch<React.SetStateAction<IElectronicProductCode[]>>
	setScannedOrders: React.Dispatch<React.SetStateAction<ScannedOrder[]>>
	setScannedOrderSizing: React.Dispatch<React.SetStateAction<ScannedOrderSizing[]>>
	setConnection: React.Dispatch<React.SetStateAction<string>>
	setScanningStatus: React.Dispatch<React.SetStateAction<ScanningStatus>>
	setSelectedOrder: React.Dispatch<React.SetStateAction<string>>
	handleToggleScanning: () => void
	resetScannedOrders: () => void
	resetScanningStatus: () => void
	resetConnection: () => void
}

const PageContext = createContext<TPageContext>(null)

export const PageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [scanningStatus, setScanningStatus, resetScanningStatus] = useResetState<ScanningStatus | undefined>(undefined)
	const [connection, setConnection, resetConnection] = useResetState<string>('')
	const [scannedEPCs, setScannedEPCs, resetScannedEPCs] = useResetState<IElectronicProductCode[]>([])
	const [scannedOrderSizing, setScannedOrderSizing] = useState([])
	const [scannedOrders, setScannedOrders, resetScannedOrders] = useResetState<ScannedOrder[]>([])
	const [selectedOrder, setSelectedOrder, resetSeletedOrder] = useResetState<string>('')
	const queryClient = useQueryClient()

	useUpdateEffect(() => {
		// Reset scanned result on scanning status is reset
		if (typeof scanningStatus === 'undefined') {
			resetScannedOrders()
			resetScannedEPCs()
			resetSeletedOrder()
			queryClient.removeQueries({ queryKey: [RFID_EPC_PROVIDE_TAG] })
		}
	}, [scanningStatus])

	const handleToggleScanning = useMemoizedFn(() => {
		setScanningStatus((prev) => {
			switch (true) {
				case typeof prev === 'undefined':
					return 'scanning'
				case prev === 'stopped':
					return 'scanning'
				case prev === 'scanning':
					return 'stopped'
			}
		})
	})

	const memorizedValues = useMemo(
		() => ({
			scannedEPCs,
			connection,
			scanningStatus,
			scannedOrders,
			scannedOrderSizing,
			selectedOrder,
			resetScannedOrders,
			resetScanningStatus,
			resetConnection,
			setScannedEPCs,
			setScannedOrders,
			setScannedOrderSizing,
			setConnection,
			setScanningStatus,
			setSelectedOrder,
			handleToggleScanning
		}),
		[scannedEPCs, connection, scanningStatus, scannedOrders, scannedOrderSizing, selectedOrder]
	)

	return <PageContext.Provider value={memorizedValues}>{children}</PageContext.Provider>
}

export const usePageContext = () => useContext(PageContext)
