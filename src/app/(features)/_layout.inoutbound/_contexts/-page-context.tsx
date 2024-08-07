import { IElectronicProductCode } from '@/common/types/entities'
import { useQueryClient } from '@tanstack/react-query'
import { useHistoryTravel, useMemoizedFn, useResetState, useUpdateEffect } from 'ahooks'
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
	back: () => void
	forward: () => void
	resetScannedOrders: (initialData: Array<ScannedOrder>) => void
	resetScanningStatus: () => void
	resetConnection: () => void
	forwardLength: number
	backLength: number
}

const PageContext = createContext<TPageContext>(null)

export const PageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [scanningStatus, setScanningStatus, resetScanningStatus] = useResetState<ScanningStatus | undefined>(undefined)
	const [connection, setConnection, resetConnection] = useResetState<string>('')
	const [scannedEPCs, setScannedEPCs, resetScannedEPCs] = useResetState<IElectronicProductCode[]>([])
	const [scannedOrderSizing, setScannedOrderSizing] = useState([])
	const {
		value: scannedOrders,
		setValue: setScannedOrders,
		forwardLength,
		backLength,
		back,
		forward,
		reset: resetScannedOrders
	} = useHistoryTravel<ScannedOrder[]>([])
	const [selectedOrder, setSelectedOrder, resetSeletedOrder] = useResetState<string>('')
	const queryClient = useQueryClient()

	useUpdateEffect(() => {
		// Reset scanned result on scanning status is reset
		if (typeof scanningStatus === 'undefined') {
			resetScannedOrders([])
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

	const memorizedStates = useMemo(
		() => ({
			scannedEPCs,
			connection,
			scanningStatus,
			scannedOrders,
			scannedOrderSizing,
			selectedOrder,
			forwardLength,
			backLength
		}),
		[
			scannedEPCs,
			connection,
			scanningStatus,
			scannedOrders,
			scannedOrderSizing,
			selectedOrder,
			forwardLength,
			backLength
		]
	)

	return (
		<PageContext.Provider
			value={{
				...memorizedStates,
				back,
				forward,
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
			}}>
			{children}
		</PageContext.Provider>
	)
}

export const usePageContext = () => useContext(PageContext)
