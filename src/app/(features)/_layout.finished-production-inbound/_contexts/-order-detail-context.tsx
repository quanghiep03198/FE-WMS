import { pick, uniqBy } from 'lodash'
import { createContext, use, useRef } from 'react'
import { StoreApi, create, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'
// import { OrderSize } from './-page-context'

type SelectedRow = {
	mo_no: string
	shoes_style_code_factory: string
	mat_ecolor: string
	size_numcode?: string
	scanned_size_qty: number
}

type TOrderDetailContext = {
	selectedRows: Array<SelectedRow>
	exchangeEpcDialogOpen: boolean
	exchangeOrderDialogOpen: boolean
	craftEpcInfoDialogOpen: boolean
	defaultExchangeEpcFormValues: SelectedRow
	defaultExchangeOrderFormValues: Partial<SelectedRow>
	pushSelectedRow: (order: SelectedRow) => void
	pullSelectedRow: (order: SelectedRow) => void
	setSelectedRows: (orders: Array<SelectedRow>) => void
	resetSelectedRows: () => void
	setExchangeEpcDialogOpen: (value: boolean) => void
	setExchangeOrderDialogOpen: (value: boolean) => void
	setCraftEpcInfoDialogOpen: (value: boolean) => void
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
				craftEpcInfoDialogOpen: false,
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
				setCraftEpcInfoDialogOpen: (value) => {
					set((state) => {
						state.craftEpcInfoDialogOpen = value
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

export const useOrderDetailContext = <T extends TOrderDetailContext, K extends keyof TOrderDetailContext>(
	...selectors: K[]
) => {
	const store = use(OrderDetailContext)
	if (!store) throw new Error('Missing store provider')
	if (!selectors) return useStore(store)
	return useStore(
		store,
		useShallow((state) => pick(state, selectors))
	) as Pick<T, K>
}
