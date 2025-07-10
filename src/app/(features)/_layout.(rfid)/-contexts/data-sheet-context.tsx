import { IElectronicProductCode } from '@/common/types/entities'
import { pick, uniqBy } from 'lodash'
import { createContext, use, useRef } from 'react'
import { create, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'

type RestorableElectronicProductCode = IElectronicProductCode & { scanned?: boolean }

type DataRestorationFilterStore = {
	searchTerm: string
	advancedFilters: {
		shoes_style: string
		color_sn: string
		mo_no: string
		size_numcode: string
		scanned?: boolean
		scannable?: boolean
	}
	selectedItems: Array<RestorableElectronicProductCode>
	limit: number
	setLimit: (value: number) => void
	setSearchTerm: (term: string) => void
	setAdvancedFilters: (values: DataRestorationFilterStore['advancedFilters']) => void
	addItemToSet: (item: RestorableElectronicProductCode) => void
	addAllItemsToSet: (items: RestorableElectronicProductCode[]) => void
	removeItemFromSet: (item: RestorableElectronicProductCode) => void
	removeAllItemsFromSet: () => void
}

const DEFAULT_PROPS: Pick<DataRestorationFilterStore, 'limit' | 'searchTerm' | 'advancedFilters' | 'selectedItems'> = {
	limit: 100,
	searchTerm: '',
	advancedFilters: {
		shoes_style: '',
		color_sn: '',
		mo_no: '',
		size_numcode: '',
		scanned: null
	},
	selectedItems: []
}

const RestorationFilterContext = createContext<StoreApi<DataRestorationFilterStore>>(null)

export const DataRestorationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const store = useRef<StoreApi<DataRestorationFilterStore>>(null)

	if (store.current === null) {
		store.current = create<DataRestorationFilterStore>()(
			immer((set) => ({
				...DEFAULT_PROPS,
				setLimit: (value: number) => {
					set((state) => {
						state.limit = value
					})
				},
				setSearchTerm: (term: string) => {
					set((state) => {
						state.searchTerm = term
					})
				},
				setAdvancedFilters: (values) => {
					set((state) => {
						state.advancedFilters = values
					})
				},
				resetAllFilters: () => {
					set((state) => {
						state.searchTerm = DEFAULT_PROPS.searchTerm
						state.advancedFilters = DEFAULT_PROPS.advancedFilters
					})
				},
				addItemToSet: (item: RestorableElectronicProductCode) => {
					set((state) => {
						state.selectedItems = uniqBy([...state.selectedItems, item], (item) => item.epc)
					})
				},
				addAllItemsToSet: (items: RestorableElectronicProductCode[]) => {
					set((state) => {
						state.selectedItems = uniqBy(items, (item) => item.epc)
					})
				},
				removeItemFromSet: (item: IElectronicProductCode) => {
					set((state) => {
						state.selectedItems = state.selectedItems.filter((i) => i.epc !== item.epc)
					})
				},
				removeAllItemsFromSet: () => {
					set((state) => {
						state.selectedItems = []
					})
				}
			}))
		)
	}

	return <RestorationFilterContext.Provider value={store.current}>{children}</RestorationFilterContext.Provider>
}

export const useDataRestorationContext = <
	T extends DataRestorationFilterStore,
	K extends keyof DataRestorationFilterStore
>(
	...selectors: K[]
) => {
	const store = use(RestorationFilterContext)
	if (!store) throw new Error('Missing store provider')
	if (!selectors) return useStore(store)
	return useStore(
		store,
		useShallow((state) => pick(state, selectors))
	) as Pick<T, K>
}
