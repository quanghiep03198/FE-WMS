import { CheckedState } from '@radix-ui/react-checkbox'
import { useResetState } from 'ahooks'
import { createContext, use, useEffect, useState } from 'react'

type TListPanelContext = {
	selectedItems: Array<number>
	deselectedItems: Array<number>
	isAllItemsSelected: CheckedState
	setIsAllItemsSelected: React.Dispatch<React.SetStateAction<CheckedState>>
	addSelectedItem: (id: number) => void
	removeSelectedItem: (id: number) => void
	resetSelectedItems: () => void
}

const ListPanelContext = createContext<TListPanelContext>(null)

export const ListPanelProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [selectedItems, setSelectedItems, resetSelectedItems] = useResetState<number[]>([])
	const [deselectedItems, setDeselectedItems, resetDeselectedItems] = useResetState<number[]>([])
	const [checked, setChecked] = useState<CheckedState>(false)

	const addSelectedItem = (id: number): void => {
		setSelectedItems((prev) => [...new Set([...prev, id])])
		setDeselectedItems((prev) => prev.filter((item) => item !== id))
	}

	const removeSelectedItem = (id: number): void => {
		setSelectedItems((prev) => prev.filter((item) => item !== id))
		setDeselectedItems((prev) => [...new Set([...prev, id])])
	}

	useEffect(() => {
		if (checked === 'indeterminate') return
		else if (checked === true) {
			resetDeselectedItems()
			resetSelectedItems()
		} else {
			resetSelectedItems()
			resetDeselectedItems()
		}
	}, [checked])

	return (
		<ListPanelContext.Provider
			value={{
				isAllItemsSelected: checked,
				selectedItems,
				deselectedItems,
				setIsAllItemsSelected: setChecked,
				addSelectedItem,
				removeSelectedItem,
				resetSelectedItems
			}}>
			{children}
		</ListPanelContext.Provider>
	)
}

export const useListPanelContext = () => use(ListPanelContext)
