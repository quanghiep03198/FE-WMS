/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, useContext, useRef } from 'react'
import { StoreApi, create, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'
import { OrderItem, OrderSize } from './-page-context'

type TOrderDetailContext = {
	selectedRows: Array<OrderSize>
	pushSelectedRow: (order: OrderSize) => void
	pullSelectedRow: (order: OrderSize) => void
	resetSelectedRows: () => void
	exchangeEpcDialogOpen: boolean
	setExchangeEpcDialogOpen: (value: boolean) => void
	exchangeOrderDialogOpen: boolean
	setExchangeOrderDialogOpen: (value: boolean) => void
	defaultExchangeEpcFormValues: OrderSize
	setDefaultExchangeEpcFormValues: (value: OrderSize) => void
	defaultExchangeOrderFormValues: OrderItem
	setDefaultExchangeOrderFormValues: (value: OrderItem) => void
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
						state.selectedRows = [...new Set([...state.selectedRows, order])]
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
				}
			}))
		)

	return <OrderDetailContext.Provider value={storeRef.current}>{children}</OrderDetailContext.Provider>
}

export const useOrderDetailContext = (selector: (state: TOrderDetailContext) => Partial<TOrderDetailContext>) => {
	const store = useContext(OrderDetailContext)
	if (!store) throw new Error('Missing StoreProvider')
	return useStore(store, useShallow(selector))
}
