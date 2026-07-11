import type { IElectronicProductCode } from '@/common/types/entities'
import { createStoreSelector } from '@/hooks/use-store-selector'
import { uniqBy } from 'lodash-es'
import { createContext, useRef } from 'react'
import type { StoreApi } from 'zustand'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type RestorableElectronicProductCode = IElectronicProductCode & { scanned?: boolean }

type DataRestorationFilterStore = {
	selectedItems: Array<RestorableElectronicProductCode>
	addItemToSet: (item: RestorableElectronicProductCode) => void
	addAllItemsToSet: (items: RestorableElectronicProductCode[]) => void
	removeItemFromSet: (item: RestorableElectronicProductCode) => void
	removeAllItemsFromSet: () => void
}

const DEFAULT_PROPS: Pick<DataRestorationFilterStore, 'selectedItems'> = {
	selectedItems: []
}

const RestorationFilterContext = createContext<StoreApi<DataRestorationFilterStore>>(null)

export const DataRestorationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const store = useRef<StoreApi<DataRestorationFilterStore>>(null)

	if (store.current === null) {
		store.current = create<DataRestorationFilterStore>()(
			immer((set) => ({
				...DEFAULT_PROPS,
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

export const useDataRestorationContext = createStoreSelector(RestorationFilterContext)
