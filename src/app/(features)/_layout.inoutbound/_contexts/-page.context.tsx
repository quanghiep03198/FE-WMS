import { IElectronicProductCode } from '@/common/types/entities'
import { useQueryClient } from '@tanstack/react-query'
import { useDeepCompareEffect, useHistoryTravel, useMemoizedFn, useResetState } from 'ahooks'
import { createContext, useContext, useState } from 'react'
import { RFID_EPC_PROVIDE_TAG } from '../_composables/-use-rfid-api'

export type ScanningStatus = 'scanning' | 'stopped' | 'finished' | undefined
export type ScannedOrder = { orderCode: string; totalEPCs: number }

type TPageContext = {
	scannedEPCs: Array<IElectronicProductCode>
	scannedOrders: Array<ScannedOrder>
	scanningStatus: ScanningStatus
	connection: string
	selectedOrder: string | null
	setScannedEPCs: React.Dispatch<React.SetStateAction<IElectronicProductCode[]>>
	setScannedOrders: React.Dispatch<React.SetStateAction<ScannedOrder[]>>
	setConnection: React.Dispatch<React.SetStateAction<string>>
	setScanningStatus: React.Dispatch<React.SetStateAction<ScanningStatus>>
	setSelectedOrder: React.Dispatch<React.SetStateAction<string>>
	handleToggleScanning: () => void
	back: () => void
	forward: () => void
	resetScannedOrders: (initialData: Array<ScannedOrder>) => void
	resetScanningStatus: () => void
	forwardLength: number
	backLength: number
}

const PageContext = createContext<TPageContext>(null)

export const PageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [scanningStatus, setScanningStatus, resetScanningStatus] = useResetState<ScanningStatus | undefined>(undefined)
	const [connection, setConnection] = useState<string | undefined>(undefined)
	const [scannedEPCs, setScannedEPCs, resetScannedEPCs] = useResetState<IElectronicProductCode[]>([])
	const {
		value: scannedOrders,
		setValue: setScannedOrders,
		forwardLength,
		backLength,
		back,
		forward,
		reset: resetScannedOrders
	} = useHistoryTravel<ScannedOrder[]>([])
	const [selectedOrder, setSelectedOrder, resetSeletedOrder] = useResetState<string>(undefined)
	const queryClient = useQueryClient()

	useDeepCompareEffect(() => {
		// Reset scanned result on scanning status is reset
		if (typeof scanningStatus === 'undefined') {
			resetScannedOrders([])
			resetScannedEPCs()
			resetSeletedOrder()
			queryClient.removeQueries({ queryKey: [RFID_EPC_PROVIDE_TAG] })
			// resetConnection()
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

	return (
		<PageContext.Provider
			value={{
				scannedEPCs,
				connection,
				scanningStatus,
				scannedOrders,
				selectedOrder,
				forwardLength,
				backLength,
				back,
				forward,
				resetScannedOrders,
				resetScanningStatus,
				setScannedEPCs,
				setScannedOrders,
				setConnection,
				setScanningStatus,
				setSelectedOrder,
				handleToggleScanning
			}}>
			{children}
		</PageContext.Provider>
	)
}

export const usePageStore = () => useContext(PageContext)
