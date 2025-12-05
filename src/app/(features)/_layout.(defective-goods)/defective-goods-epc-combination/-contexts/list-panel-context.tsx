import { CheckedState } from '@radix-ui/react-checkbox'
import { createContext, use, useCallback, useEffect, useState } from 'react'

// Persistent storage key
const SELECTION_STORAGE_KEY = 'defectiveGoodsSelectionState'

type SelectionMode = 'none' | 'some' | 'all' | 'all-except'

type SelectionState = {
	mode: SelectionMode
	selectedIds: Set<number> // Specific selected IDs
	excludedIds: Set<number> // Excluded IDs when mode = 'all-except'
	totalCount: number // Total records on server
	pageItems: number[] // Current page item IDs
}

type TListPanelContext = {
	isAllCardExpaned: boolean
	toggleAllCardExpaned: () => void

	// Core selection state
	selectionState: SelectionState

	// Selection operations
	updatePageItems: (items: number[], totalCount: number) => void
	toggleItem: (id: number) => void
	toggleAll: () => void
	isItemSelected: (id: number) => boolean
	getSelectedCount: () => number
	clearSelection: () => void

	// Computed selection info
	getSelectedIds: () => number[]
	getDeselectedIds: () => number[]
	getCheckboxState: () => CheckedState
}

const ListPanelContext = createContext<TListPanelContext>(null)

export const ListPanelProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [isAllCardExpaned, setIsAllCardExpaned] = useState<boolean>(false)

	const toggleAllCardExpaned = useCallback(() => {
		setIsAllCardExpaned((prev) => !prev)
	}, [])

	const [selectionState, setSelectionState] = useState<SelectionState>({
		mode: 'none',
		selectedIds: new Set(),
		excludedIds: new Set(),
		totalCount: 0,
		pageItems: []
	})

	// Update page items and total count when pagination changes
	const updatePageItems = useCallback((items: number[], totalCount: number) => {
		setSelectionState((prev) => ({
			...prev,
			pageItems: items,
			totalCount
		}))
	}, [])

	// Check if an item is selected based on current selection mode
	const isItemSelected = useCallback(
		(id: number): boolean => {
			const { mode, selectedIds, excludedIds } = selectionState

			switch (mode) {
				case 'none':
					return false
				case 'some':
					return selectedIds.has(id)
				case 'all':
					return true
				case 'all-except':
					return !excludedIds.has(id)
				default:
					return false
			}
		},
		[selectionState]
	)

	// Toggle selection state of a single item
	const toggleItem = useCallback(
		(id: number) => {
			setSelectionState((prev) => {
				const isCurrentlySelected = isItemSelected(id)
				const newState = { ...prev }

				if (isCurrentlySelected) {
					// Deselecting item
					switch (prev.mode) {
						case 'some':
							newState.selectedIds = new Set(prev.selectedIds)
							newState.selectedIds.delete(id)
							if (newState.selectedIds.size === 0) {
								newState.mode = 'none'
							}
							break
						case 'all':
							// Switch to all-except mode
							newState.mode = 'all-except'
							newState.excludedIds = new Set([id])
							break
						case 'all-except':
							newState.excludedIds = new Set(prev.excludedIds)
							newState.excludedIds.add(id)
							break
					}
				} else {
					// Selecting item
					switch (prev.mode) {
						case 'none':
							newState.mode = 'some'
							newState.selectedIds = new Set([id])
							break
						case 'some':
							newState.selectedIds = new Set(prev.selectedIds)
							newState.selectedIds.add(id)
							// Check if all page items are now selected
							if (prev.pageItems.every((itemId) => itemId === id || prev.selectedIds.has(itemId))) {
								// Check if we've selected everything
								if (newState.selectedIds.size === prev.totalCount) {
									newState.mode = 'all'
									newState.selectedIds = new Set()
								}
							}
							break
						case 'all-except':
							newState.excludedIds = new Set(prev.excludedIds)
							newState.excludedIds.delete(id)
							if (newState.excludedIds.size === 0) {
								newState.mode = 'all'
							}
							break
					}
				}

				return newState
			})
		},
		[isItemSelected]
	)

	// Toggle all items selection
	const toggleAll = useCallback(() => {
		setSelectionState((prev) => {
			switch (prev.mode) {
				case 'none':
				case 'some':
					return {
						...prev,
						mode: 'all',
						selectedIds: new Set(),
						excludedIds: new Set()
					}
				case 'all':
				case 'all-except':
					return {
						...prev,
						mode: 'none',
						selectedIds: new Set(),
						excludedIds: new Set()
					}
				default:
					return prev
			}
		})
	}, [])

	// Get total selected count
	const getSelectedCount = useCallback((): number => {
		const { mode, selectedIds, excludedIds, totalCount } = selectionState

		switch (mode) {
			case 'none':
				return 0
			case 'some':
				return selectedIds.size
			case 'all':
				return totalCount
			case 'all-except':
				return Math.max(0, totalCount - excludedIds.size)
			default:
				return 0
		}
	}, [selectionState])

	// Clear all selections
	const clearSelection = useCallback(() => {
		setSelectionState((prev) => {
			const newState = {
				...prev,
				mode: 'none' as SelectionMode,
				selectedIds: new Set<number>(),
				excludedIds: new Set<number>()
			}
			// Persist to localStorage
			try {
				sessionStorage.setItem(
					SELECTION_STORAGE_KEY,
					JSON.stringify({
						mode: newState.mode,
						selectedIds: Array.from(newState.selectedIds),
						excludedIds: Array.from(newState.excludedIds)
					})
				)
			} catch (error) {
				console.warn('Failed to persist selection state:', error)
			}
			return newState
		})
	}, [])

	// Load persisted selection state on mount
	useEffect(() => {
		try {
			const stored = sessionStorage.getItem(SELECTION_STORAGE_KEY)
			if (stored) {
				const parsed = JSON.parse(stored)
				setSelectionState((prev) => ({
					...prev,
					mode: parsed.mode || 'none',
					selectedIds: new Set(parsed.selectedIds || []),
					excludedIds: new Set(parsed.excludedIds || [])
				}))
			}
		} catch (error) {
			console.warn('Failed to load persisted selection state:', error)
		}
	}, [])

	// Auto-persist selection state changes
	useEffect(() => {
		try {
			sessionStorage.setItem(
				SELECTION_STORAGE_KEY,
				JSON.stringify({
					mode: selectionState.mode,
					selectedIds: Array.from(selectionState.selectedIds),
					excludedIds: Array.from(selectionState.excludedIds)
				})
			)
		} catch (error) {
			console.warn('Failed to persist selection state:', error)
		}
	}, [selectionState.mode, selectionState.selectedIds, selectionState.excludedIds])

	// Computed selection info
	const getSelectedIds = useCallback((): number[] => {
		const { mode, selectedIds, excludedIds, pageItems } = selectionState

		switch (mode) {
			case 'none':
				return []
			case 'some':
				return Array.from(selectedIds)
			case 'all':
				return pageItems // Return current page items as selected
			case 'all-except':
				return pageItems.filter((id) => !excludedIds.has(id))
			default:
				return []
		}
	}, [selectionState])

	const getDeselectedIds = useCallback((): number[] => {
		const { mode, excludedIds } = selectionState
		return mode === 'all-except' ? Array.from(excludedIds) : []
	}, [selectionState])

	const getCheckboxState = useCallback((): CheckedState => {
		const { mode, selectedIds, excludedIds, pageItems } = selectionState

		switch (mode) {
			case 'none':
				return false
			case 'some': {
				// Check if all page items are selected
				const allPageSelected = pageItems.every((id) => selectedIds.has(id))
				const somePageSelected = pageItems.some((id) => selectedIds.has(id))

				if (allPageSelected) return true
				if (somePageSelected) return 'indeterminate'
				return false
			}
			case 'all':
				return true
			case 'all-except': {
				const hasExcludedInPage = pageItems.some((id) => excludedIds.has(id))
				return hasExcludedInPage ? 'indeterminate' : true
			}
			default:
				return false
		}
	}, [selectionState])

	return (
		<ListPanelContext.Provider
			value={{
				isAllCardExpaned,
				toggleAllCardExpaned,

				// Core state
				selectionState,

				// Operations
				updatePageItems,
				toggleItem,
				toggleAll,
				isItemSelected,
				getSelectedCount,
				clearSelection,

				// Computed info
				getSelectedIds,
				getDeselectedIds,
				getCheckboxState
			}}>
			{children}
		</ListPanelContext.Provider>
	)
}

export const useListPanelContext = () => use(ListPanelContext)
