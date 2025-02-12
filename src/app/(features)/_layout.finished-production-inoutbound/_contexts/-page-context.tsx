'use no memo'

import { IElectronicProductCode } from '@/common/types/entities'
import { useQueryClient } from '@tanstack/react-query'
import { useLocalStorageState } from 'ahooks'
import { pick } from 'lodash'
import React, { createContext, use, useEffect, useRef } from 'react'
import { StoreApi, create, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'
import { FP_EPC_LIST_PROVIDE_TAG, FP_ORDER_DETAIL_PROVIDE_TAG } from '../_apis/rfid.api'
import { FP_RFID_SETTINGS_KEY } from '../_constants/rfid.const'
import { RFIDSettings } from '../index.lazy'

export type ScanningStatus = 'connecting' | 'connected' | 'disconnected' | undefined
export type Log = {
	message: string
	timestamp?: Date
	type: 'info' | 'error'
}
export type OrderItem = {
	mo_no: string
	mat_code: string
	shoes_style_code_factory: string
	sizes: Array<{
		size_numcode: string
		count: number
	}>
}

type PageContextStore = {
	currentPage: number | null
	scannedEpc: Pagination<IElectronicProductCode>
	scannedOrders: Array<OrderItem>
	scanningStatus: ScanningStatus
	connection: string
	selectedOrder: string | undefined
	logs: Array<Log>
	pollingDuration: number
	setCurrentPage: (page: number | null) => void
	setScanningStatus: (status: ScanningStatus) => void
	setConnection: (value: string) => void
	setSelectedOrder: (value: string) => void
	setScannedEpc: (data: Pagination<IElectronicProductCode>) => void
	setScannedOrders: (data: Array<OrderItem>) => void
	setPollingDuration: (data: number) => void
	writeLog: (data: Omit<Log, 'timestamp'>) => void
	clearLog: () => void
	handleToggleScanning: () => void
	reset: () => void
}
export const DEFAULT_PROPS: Pick<
	PageContextStore,
	| 'currentPage'
	| 'scannedEpc'
	| 'scannedOrders'
	| 'scanningStatus'
	| 'connection'
	| 'selectedOrder'
	| 'logs'
	| 'pollingDuration'
> = {
	currentPage: 1,
	scanningStatus: undefined,
	connection: '',
	selectedOrder: 'all',
	logs: [],
	pollingDuration: 750,
	scannedEpc: {
		data: [],
		hasNextPage: false,
		hasPrevPage: false,
		limit: 100,
		page: 1,
		totalDocs: 0,
		totalPages: 0
	},
	scannedOrders: []
}

const MAX_LINES_OF_LOG = 100

const PageContext = createContext<StoreApi<PageContextStore>>(null)

export const PageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const storeRef = useRef<StoreApi<PageContextStore>>(null)
	const queryClient = useQueryClient()

	const [settings] = useLocalStorageState<RFIDSettings>(FP_RFID_SETTINGS_KEY, {
		listenStorageChange: true
	})

	if (!storeRef.current) {
		storeRef.current = create<PageContextStore>()(
			immer((set) => ({
				...DEFAULT_PROPS,
				setCurrentPage: (page: number | null) => {
					set((state) => {
						state.currentPage = page
					})
				},
				setScanningStatus: (status) =>
					set((state) => {
						state.scanningStatus = status
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
				setPollingDuration: (data) => {
					set((state) => {
						state.pollingDuration = data
					})
				},
				writeLog: (log) => {
					set((state) => {
						if (state.logs.length >= MAX_LINES_OF_LOG) state.logs.pop()
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
					if (!settings?.preserveLog) {
						set((state) => {
							state.logs = DEFAULT_PROPS.logs
						})
					}
					set((state) => {
						state.currentPage = DEFAULT_PROPS.currentPage
						state.connection = DEFAULT_PROPS.connection
						state.scanningStatus = DEFAULT_PROPS.scanningStatus
						state.scannedEpc = DEFAULT_PROPS.scannedEpc
						state.scannedOrders = DEFAULT_PROPS.scannedOrders
						state.selectedOrder = DEFAULT_PROPS.selectedOrder
					})
				}
			}))
		)
	}

	useEffect(() => {
		queryClient.removeQueries({
			queryKey: [FP_EPC_LIST_PROVIDE_TAG, FP_ORDER_DETAIL_PROVIDE_TAG],
			type: 'all'
		})
	}, [])

	return <PageContext.Provider value={storeRef.current}>{children}</PageContext.Provider>
}

export const usePageContext = <T extends PageContextStore, K extends keyof PageContextStore>(...selectors: K[]) => {
	const store = use(PageContext)
	if (!store) throw new Error('Missing store provider')
	if (!selectors) return useStore(store)
	return useStore(
		store,
		useShallow((state) => pick(state, selectors))
	) as Pick<T, K>
}
