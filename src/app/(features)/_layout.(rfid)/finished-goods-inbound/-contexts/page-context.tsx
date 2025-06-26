'use no memo'

import { IElectronicProductCode } from '@/common/types/entities'
import { pick } from 'lodash'
import React, { createContext, use, useRef } from 'react'
import { StoreApi, create, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'
import { OrderItem } from '../..'

export type ScanningStatus = 'connecting' | 'connected' | 'disconnected' | undefined

type PageContextStore = {
	currentPage: number | null
	scannedEpc: Pagination<IElectronicProductCode>
	scannedOrders: Array<OrderItem>
	scanningStatus: ScanningStatus
	connection: string
	selectedOrder: string
	currentFactoryProduce: string | null
	setCurrentPage: (page: number | null) => void
	setScanningStatus: (status: ScanningStatus) => void
	setConnection: (value: string) => void
	setSelectedOrder: (value: string) => void
	setCurrentFactoryProduce: (value: string) => void
	setScannedEpc: (data: Pagination<IElectronicProductCode>) => void
	setScannedOrders: (data: Array<OrderItem>) => void
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
	| 'currentFactoryProduce'
> = {
	currentPage: 1,
	scanningStatus: undefined,
	connection: '',
	selectedOrder: 'all',
	currentFactoryProduce: '',
	scannedEpc: {
		data: [],
		hasNextPage: false,
		hasPrevPage: false,
		nextPage: null,
		prevPage: null,
		limit: 100,
		page: 1,
		totalDocs: 0,
		totalPages: 0
	},
	scannedOrders: []
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
				setSelectedOrder: (value) => {
					set((state) => {
						state.selectedOrder = value
					})
				},
				setCurrentFactoryProduce: (value) => {
					set((state) => {
						state.currentFactoryProduce = value
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
