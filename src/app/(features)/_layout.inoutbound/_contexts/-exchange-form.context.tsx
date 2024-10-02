/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, useContext, useRef } from 'react'
import { StoreApi, create, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'
import { OrderSize } from './-page-context'

type TOrderDetailContext = {
	open: boolean
	setOpen: (value: boolean) => void
	defaultValues: OrderSize
	setDefaultValues: (value: OrderSize) => void
}

const OrderDetailContext = createContext<StoreApi<TOrderDetailContext>>(null)

export const OrderDetailProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const storeRef = useRef<StoreApi<TOrderDetailContext>>(null)
	if (!storeRef.current)
		storeRef.current = create<TOrderDetailContext>()(
			immer((set) => ({
				open: false,
				defaultValues: null,
				setOpen: (value) =>
					set((state) => {
						state.open = value
					}),
				setDefaultValues: (value) =>
					set((state) => {
						state.defaultValues = value
					})
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
