import { IElectronicProductCode } from '@/common/types/entities'
import { pick, uniqBy } from 'lodash'
import { createContext, use, useRef } from 'react'
import { create, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'

type ArchivedRestorationFilterStore = {
	searchTerm: string
	advancedFilters: {
		shoes_style_code_factory: string
		color_sn: string
		mo_no: string
		size_numcode: string
	}
	selectedItems: IElectronicProductCode[]
	setSearchTerm: (term: string) => void
	setAdvancedFilters: (values: ArchivedRestorationFilterStore['advancedFilters']) => void
	addItemToSet: (item: IElectronicProductCode) => void
	addAllItemsToSet: (items: IElectronicProductCode[]) => void
	removeItemFromSet: (item: IElectronicProductCode) => void
	removeAllItemsFromSet: () => void
}

const DEFAULT_PROPS: Pick<ArchivedRestorationFilterStore, 'searchTerm' | 'advancedFilters' | 'selectedItems'> = {
	searchTerm: '',
	advancedFilters: {
		shoes_style_code_factory: '',
		color_sn: '',
		mo_no: '',
		size_numcode: ''
	},
	selectedItems: []
}

const RestorationFilterContext = createContext<StoreApi<ArchivedRestorationFilterStore>>(null)

export const ArchivedRestorationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const store = useRef<StoreApi<ArchivedRestorationFilterStore>>(null)

	if (store.current === null) {
		store.current = create<ArchivedRestorationFilterStore>()(
			immer((set) => ({
				...DEFAULT_PROPS,
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
				addItemToSet: (item: IElectronicProductCode) => {
					set((state) => {
						state.selectedItems = uniqBy([...state.selectedItems, item], (item) => item.epc)
					})
				},
				addAllItemsToSet: (items: IElectronicProductCode[]) => {
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

export const useArchivedRestorationContext = <
	T extends ArchivedRestorationFilterStore,
	K extends keyof ArchivedRestorationFilterStore
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
