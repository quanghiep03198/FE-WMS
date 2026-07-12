'use no memo'

import type { IElectronicProductCode, OrderItem } from '@/features/finished-goods/types'
import { createStoreSelector } from '@/hooks/use-store-selector'
import React, { createContext, useRef } from 'react'
import type { StoreApi } from 'zustand'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type ScanningStatus = 'connecting' | 'connected' | 'disconnected' | undefined

type PageContextStore = {
	currentPage: number | null
	scannedEpc: Pagination<IElectronicProductCode>
	scannedOrders: Array<OrderItem>
	scanningStatus: ScanningStatus
	selectedOrder: string
	selectedDevice: string | null
	setCurrentPage: (page: number | null) => void
	setScanningStatus: (status: ScanningStatus) => void
	setSelectedOrder: (value: string) => void
	setScannedEpc: (data: Pagination<IElectronicProductCode>) => void
	setScannedOrders: (data: Array<OrderItem>) => void
	setSelectedDevice: (deviceSerialNumber: string) => void
	handleToggleScanning: () => void
	reset: () => void
}
export const DEFAULT_PROPS: Pick<
	PageContextStore,
	'currentPage' | 'scannedEpc' | 'scannedOrders' | 'scanningStatus' | 'selectedOrder' | 'selectedDevice'
> = {
	currentPage: 1,
	scanningStatus: undefined,
	selectedDevice: null,
	selectedOrder: 'all',
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
				setSelectedDevice: (deviceSerialNumber) => {
					set((state) => {
						state.selectedDevice = deviceSerialNumber
					})
				},
				reset: () => {
					set((state) => {
						state.currentPage = DEFAULT_PROPS.currentPage
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

export const usePageContext = createStoreSelector(PageContext)
