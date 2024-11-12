/* eslint-disable react-hooks/rules-of-hooks */
import { IElectronicProductCode } from '@/common/types/entities'
import { pick } from 'lodash'
import React, { createContext, useContext, useRef } from 'react'
import { StoreApi, create, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'

export type ScanningStatus = 'connecting' | 'connected' | 'disconnected' | undefined
export type Log = {
	message: string
	timestamp?: Date
	type: 'info' | 'error'
}
export type OrderItem = {
	mo_no: string
	count: number
}
export type OrderSize = OrderItem & {
	size_numcode: string
	mat_code: string
	shoes_style_code_factory: string
}

type PageContextStore = {
	currentPage: number | null
	scannedEpc: Pagination<IElectronicProductCode>
	scannedOrders: { [key: string]: Array<OrderSize> }
	selectedOrder: string | 'all'
	scanningStatus: ScanningStatus
	connection: string
	setCurrentPage: (page: number | null) => void
	setSelectedOrder: (order: string) => void
	setScanningStatus: (status: ScanningStatus) => void
	setConnection: (value: string) => void
	setScannedEpc: (data: Pagination<IElectronicProductCode>) => void
	setScannedOrders: (data: { [key: string]: Array<OrderSize> }) => void
	handleToggleScanning: () => void
	reset: () => void
}
export const DEFAULT_PROPS: Pick<
	PageContextStore,
	'currentPage' | 'scannedEpc' | 'scannedOrders' | 'scanningStatus' | 'connection' | 'selectedOrder'
> = {
	currentPage: null,
	scanningStatus: undefined,
	connection: '',
	selectedOrder: 'all',
	scannedEpc: {
		data: [],
		hasNextPage: false,
		hasPrevPage: false,
		limit: 100,
		page: 1,
		totalDocs: 0,
		totalPages: 0
	},
	scannedOrders: {}
}

const PageContext = createContext<StoreApi<PageContextStore>>(null)

export const PageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const storeRef = useRef<StoreApi<PageContextStore>>(null)

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
				setScannedEpc: (data) => {
					set((state) => {
						state.scannedEpc = !data ? DEFAULT_PROPS.scannedEpc : data
					})
				},

				setScannedOrders: (data) => {
					set((state) => {
						state.scannedOrders = data ?? {}
					})
				},
				setSelectedOrder: (order) => {
					set((state) => {
						state.selectedOrder = order
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
					set((state) => {
						state.currentPage = DEFAULT_PROPS.currentPage
						state.selectedOrder = DEFAULT_PROPS.selectedOrder
						state.scanningStatus = DEFAULT_PROPS.scanningStatus
						state.scannedEpc = DEFAULT_PROPS.scannedEpc
						state.scannedOrders = DEFAULT_PROPS.scannedOrders
					})
				}
			}))
		)
	}

	return <PageContext.Provider value={storeRef.current}>{children}</PageContext.Provider>
}

export const usePageContext = <T extends PageContextStore, K extends keyof PageContextStore>(...selectors: K[]) => {
	const store = useContext(PageContext)
	if (!store) throw new Error('Missing store provider')
	if (!selectors) return useStore(store)
	return useStore(
		store,
		useShallow((state) => pick(state, selectors))
	) as Pick<T, K>
}
