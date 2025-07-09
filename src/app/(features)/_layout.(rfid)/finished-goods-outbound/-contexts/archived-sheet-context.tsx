import { IElectronicProductCode } from '@/common/types/entities'
import { pick, uniqBy } from 'lodash'
import { createContext, use, useRef } from 'react'
import { create, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'

type RestorableElectronicProductCode = IElectronicProductCode & { scanned: boolean }

type ArchivedRestorationFilterStore = {
	searchTerm: string
	advancedFilters: {
		shoes_style: string
		color_sn: string
		mo_no: string
		size_numcode: string
		scanned: boolean
	}
	selectedItems: Array<RestorableElectronicProductCode>
	limit: number
	setLimit: (value: number) => void
	setSearchTerm: (term: string) => void
	setAdvancedFilters: (values: ArchivedRestorationFilterStore['advancedFilters']) => void
	addItemToSet: (item: RestorableElectronicProductCode) => void
	addAllItemsToSet: (items: RestorableElectronicProductCode[]) => void
	removeItemFromSet: (item: RestorableElectronicProductCode) => void
	removeAllItemsFromSet: () => void
}

const DEFAULT_PROPS: Pick<
	ArchivedRestorationFilterStore,
	'limit' | 'searchTerm' | 'advancedFilters' | 'selectedItems'
> = {
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

const RestorationFilterContext = createContext<StoreApi<ArchivedRestorationFilterStore>>(null)

export const ArchivedRestorationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const store = useRef<StoreApi<ArchivedRestorationFilterStore>>(null)

	if (store.current === null) {
		store.current = create<ArchivedRestorationFilterStore>()(
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

export const useArchivedRestorationContext = <
	T extends ArchivedRestorationFilterStore,
	K extends keyof ArchivedRestorationFilterStore
>(
	...selectors: K[]
) => {
	const store = use(RestorationFilterContext)
	if (!store) throw new Error('Missing store provider')
	const state =
		selectors.length === 0
			? useStore(store)
			: useStore(
					store,
					useShallow((state) => pick(state, selectors))
				)
	return state as Pick<T, K>
}
