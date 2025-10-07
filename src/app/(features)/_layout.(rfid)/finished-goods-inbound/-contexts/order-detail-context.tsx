import { useStoreSelector } from '@/common/hooks/use-store-selector'
import { uniqBy } from 'lodash'
import { createContext, useRef } from 'react'
import { StoreApi, create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
// import { OrderSize } from './-page-context'

type SelectedRow = {
	mo_no: string
	factory_shoes_style: string
	color_sn: string
	size_numcode?: string
	scanned_size_qty: number
}

type TOrderDetailContext = {
	selectedRows: Array<SelectedRow>
	exchangeEpcDialogOpen: boolean
	exchangeOrderDialogOpen: boolean
	fillEpcDataDialogOpen: boolean
	defaultExchangeEpcFormValues: SelectedRow
	defaultExchangeOrderFormValues: Partial<SelectedRow>
	pushSelectedRow: (order: SelectedRow) => void
	pullSelectedRow: (order: SelectedRow) => void
	setSelectedRows: (orders: Array<SelectedRow>) => void
	resetSelectedRows: () => void
	setExchangeEpcDialogOpen: (value: boolean) => void
	setExchangeOrderDialogOpen: (value: boolean) => void
	setFillEpcDataDialogOpen: (value: boolean) => void
	setDefaultExchangeEpcFormValues: (value: SelectedRow) => void
	setDefaultExchangeOrderFormValues: (value: Partial<SelectedRow>) => void
}

const OrderDetailContext = createContext<StoreApi<TOrderDetailContext>>(null)

export const OrderDetailProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const storeRef = useRef<StoreApi<TOrderDetailContext>>(null)
	if (!storeRef.current)
		storeRef.current = create<TOrderDetailContext>()(
			immer((set) => ({
				selectedRows: [],
				exchangeEpcDialogOpen: false,
				exchangeOrderDialogOpen: false,
				fillEpcDataDialogOpen: false,
				defaultExchangeEpcFormValues: null,
				defaultExchangeOrderFormValues: null,
				setExchangeEpcDialogOpen: (value) => {
					set((state) => {
						state.exchangeEpcDialogOpen = value
					})
				},
				setExchangeOrderDialogOpen: (value) => {
					set((state) => {
						state.exchangeOrderDialogOpen = value
					})
				},
				setFillEpcDataDialogOpen: (value) => {
					set((state) => {
						state.fillEpcDataDialogOpen = value
					})
				},
				setDefaultExchangeEpcFormValues: (value) => {
					set((state) => {
						state.defaultExchangeEpcFormValues = value
					})
				},
				setDefaultExchangeOrderFormValues: (value) => {
					set((state) => {
						state.defaultExchangeOrderFormValues = value
					})
				},
				pushSelectedRow: (order) => {
					set((state) => {
						state.selectedRows = uniqBy([...state.selectedRows, order], 'mo_no')
					})
				},
				pullSelectedRow: (order) => {
					set((state) => {
						state.selectedRows = state.selectedRows.filter((row) => row.mo_no !== order.mo_no)
					})
				},
				resetSelectedRows: () => {
					set((state) => {
						state.selectedRows = []
					})
				},
				setSelectedRows: (orders) => {
					set((state) => {
						state.selectedRows = orders
					})
				}
			}))
		)

	return <OrderDetailContext.Provider value={storeRef.current}>{children}</OrderDetailContext.Provider>
}

export const useOrderDetailContext = useStoreSelector(OrderDetailContext)
