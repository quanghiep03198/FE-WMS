import { IElectronicProductCode } from '@/common/types/entities'
import { useHistoryTravel, useReactive } from 'ahooks'
import { createContext, useContext, useState } from 'react'

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
	forwardLength: number
	backLength: number
	scannedResult: {
		scannedEPCs: Array<IElectronicProductCode>
		scannedOrders: Array<ScannedOrder>
	}
}

const PageContext = createContext<TPageContext>(null)

export const PageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [scanningStatus, setScanningStatus] = useState<ScanningStatus>(undefined)
	const [connection, setConnection] = useState<string>()
	const scannedResult = useReactive({
		scannedEPCs: [],
		scannedOrders: []
	})
	const [scannedEPCs, setScannedEPCs] = useState<IElectronicProductCode[]>([])
	const {
		value: scannedOrders,
		setValue: setScannedOrders,
		forwardLength,
		backLength,
		back,
		forward
	} = useHistoryTravel<ScannedOrder[]>([])
	const [selectedOrder, setSelectedOrder] = useState<string>(null)

	const handleToggleScanning = () => {
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
	}

	return (
		<PageContext.Provider
			value={{
				scannedEPCs,
				connection,
				scanningStatus,
				scannedOrders,
				selectedOrder,
				scannedResult,
				forwardLength,
				backLength,
				back,
				forward,
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
