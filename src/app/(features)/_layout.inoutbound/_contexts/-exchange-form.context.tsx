/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, useContext, useRef } from 'react'
import { StoreApi, create, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'
import { OrderItem, OrderSize } from './-page-context'

type TOrderDetailContext = {
	exchangeEpcDialogOpen: boolean
	setExchangeEpcDialogOpen: (value: boolean) => void
	exchangeOrderDialogOpen: boolean
	setExchangeOrderDialogOpen: (value: boolean) => void
	defaultExchangeEpcFormValues: OrderSize
	setDefaultExchangeEpcFormValues: (value: OrderSize) => void
	defaultExchangeOrderFormValues: Pick<OrderItem, 'mo_no'>
	setDefaultExchangeOrderFormValues: (value: Pick<OrderItem, 'mo_no'>) => void
}

const OrderDetailContext = createContext<StoreApi<TOrderDetailContext>>(null)

export const OrderDetailProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const storeRef = useRef<StoreApi<TOrderDetailContext>>(null)
	if (!storeRef.current)
		storeRef.current = create<TOrderDetailContext>()(
			immer((set) => ({
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
				}
			}))
		)

	return <OrderDetailContext.Provider value={storeRef.current}>{children}</OrderDetailContext.Provider>
}

export const useOrderDetailContext = (selector?: (state: TOrderDetailContext) => Partial<TOrderDetailContext>) => {
	const store = useContext(OrderDetailContext)
	if (!store) throw new Error('Missing StoreProvider')
	if (typeof selector === 'undefined') return useStore(store)
	const contextSelector = useShallow(selector)
	return useStore(store, contextSelector)
}
