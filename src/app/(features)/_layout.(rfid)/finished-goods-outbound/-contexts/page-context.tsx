'use no memo'

import type { IElectronicProductCode } from '@/common/types/entities'
import { createStoreSelector } from '@/hooks/use-store-selector'
import React, { createContext, useRef } from 'react'
import type { StoreApi } from 'zustand'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { type OrderItem } from '../..'

export type ScanningState = 'pending' | 'success' | 'error'

type PageContextStore = {
	scanningState: ScanningState
	currentPage: number | null
	scannedEpc: Pagination<IElectronicProductCode>
	scannedOrders: Array<OrderItem>
	setScanningState: (status: ScanningState) => void
	setCurrentPage: (page: number | null) => void
	setScannedEpc: (data: Pagination<IElectronicProductCode>) => void
	setScannedOrders: (data: Array<OrderItem>) => void
	reset: () => void
}

export const DEFAULT_PROPS: Pick<PageContextStore, 'scanningState' | 'currentPage' | 'scannedEpc' | 'scannedOrders'> = {
	scanningState: 'pending',
	currentPage: 1,
	scannedEpc: {
		data: [],
		hasNextPage: false,
		hasPrevPage: false,
		limit: 100,
		page: 1,
		totalDocs: 0,
		totalPages: 0,
		nextPage: null,
		prevPage: null
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
				setScanningState: (value: ScanningState) => {
					set((state) => {
						state.scanningState = value
					})
				},
				setCurrentPage: (page: number | null) => {
					set((state) => {
						state.currentPage = page
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
				reset: () => {
					set((state) => {
						state.currentPage = DEFAULT_PROPS.currentPage
						state.scannedEpc = DEFAULT_PROPS.scannedEpc
						state.scannedOrders = DEFAULT_PROPS.scannedOrders
					})
				}
			}))
		)
	}

	return <PageContext.Provider value={storeRef.current}>{children}</PageContext.Provider>
}

export const usePageContext = createStoreSelector(PageContext)
