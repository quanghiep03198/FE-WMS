/* eslint-disable react-hooks/rules-of-hooks */
import { IElectronicProductCode } from '@/common/types/entities'
import { useSessionStorageState } from 'ahooks'
import React, { createContext, useContext, useRef } from 'react'
import { StoreApi, create, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'

export type ScanningStatus = 'connecting' | 'connected' | 'disconnected' | undefined
export type OrderItem = { mo_no: string; count: number }
export type OrderSize = OrderItem & { size_numcode: string; mat_code: string }
export type Log = { message: string; timestamp?: Date; type: 'info' | 'error' }

type PageContextStore = {
	scannedEpc: Pagination<IElectronicProductCode>
	scannedOrders: Array<OrderItem>
	scannedSizes: Array<OrderSize>
	scanningStatus: ScanningStatus
	connection: string
	selectedOrder: string | undefined
	logs: Array<Log>
	pollingDuration: number
	setScanningStatus: (status: ScanningStatus) => void
	setConnection: (value: string) => void
	setSelectedOrder: (value: string) => void
	setScannedEpc: (data: Pagination<IElectronicProductCode>) => void
	setScannedOrders: (data: Array<OrderItem>) => void
	setScannedSizes: (data: Array<OrderSize>) => void
	setPollingDuration: (data: number) => void
	writeLog: (data: Omit<Log, 'timestamp'>) => void
	clearLog: () => void
	handleToggleScanning: () => void
	reset: () => void
}
export const DEFAULT_PROPS: Pick<
	PageContextStore,
	| 'scannedEpc'
	| 'scannedOrders'
	| 'scannedSizes'
	| 'scanningStatus'
	| 'connection'
	| 'selectedOrder'
	| 'logs'
	| 'pollingDuration'
> = {
	scanningStatus: undefined,
	connection: '',
	selectedOrder: 'all',
	logs: [],
	pollingDuration: 500,
	scannedEpc: {
		data: [],
		hasNextPage: false,
		hasPrevPage: false,
		limit: 100,
		page: 1,
		totalDocs: 0,
		totalPages: 0
	},
	scannedOrders: [],
	scannedSizes: []
}

const PageContext = createContext(null)

export const PageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const storeRef = useRef<StoreApi<PageContextStore>>(null)

	const [isEnablePreserveLog] = useSessionStorageState<boolean>('rfidPreserveLog', {
		listenStorageChange: true
	})

	if (!storeRef.current) {
		storeRef.current = create<PageContextStore>()(
			immer((set) => ({
				...DEFAULT_PROPS,
				setScanningStatus: (stt) =>
					set((state) => {
						state.scanningStatus = stt
					}),
				setConnection: (value) => {
					set((state) => {
						state.connection = value
					})
				},
				setSelectedOrder: (value) => {
					set((state) => {
						state.selectedOrder = value
					})
				},
				setScannedEpc: (data) => {
					set((state) => {
						state.scannedEpc = !data ? DEFAULT_PROPS.scannedEpc : data
					})
				},
				setScannedOrders: (data) => {
					set((state) => {
						state.scannedOrders = Array.isArray(data) ? data : []
					})
				},
				setScannedSizes: (data) => {
					set((state) => {
						state.scannedSizes = Array.isArray(data) ? data : []
					})
				},
				setPollingDuration: (data) => {
					set((state) => {
						state.pollingDuration = data
					})
				},
				writeLog: (log) => {
					set((state) => {
						state.logs.unshift({ timestamp: new Date(), ...log })
					})
				},
				clearLog: () => {
					set((state) => {
						state.logs = []
					})
				},
				handleToggleScanning: () => {
					set((state) => {
						switch (true) {
							case typeof state.scanningStatus === 'undefined': {
								state.scanningStatus = 'connecting'
								break
							}
							case state.scanningStatus === 'connected': {
								state.scanningStatus = 'disconnected'
								break
							}
							case state.scanningStatus === 'disconnected': {
								state.scanningStatus = 'connecting'
								break
							}
						}
					})
				},
				reset: () => {
					if (!isEnablePreserveLog) {
						set((state) => {
							state.logs = DEFAULT_PROPS.logs
						})
					}
					set((state) => {
						state.connection = DEFAULT_PROPS.connection
						state.scanningStatus = DEFAULT_PROPS.scanningStatus
						state.scannedEpc = DEFAULT_PROPS.scannedEpc
						state.scannedOrders = DEFAULT_PROPS.scannedOrders
						state.scannedSizes = DEFAULT_PROPS.scannedSizes
						state.selectedOrder = DEFAULT_PROPS.selectedOrder
					})
				}
			}))
		)
	}

	return <PageContext.Provider value={storeRef.current}>{children}</PageContext.Provider>
}

export const usePageContext = (
	selector: (state: PageContextStore) => Partial<PageContextStore>
): Partial<PageContextStore> => {
	const store = useContext(PageContext)
	if (!store) throw new Error('Missing StoreProvider')
	return useStore(store, useShallow(selector))
}
