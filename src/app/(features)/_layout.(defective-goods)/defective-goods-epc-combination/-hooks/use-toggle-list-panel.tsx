import { useMemoizedFn, useSessionStorageState } from 'ahooks'

export const useToggleListPanel = () => {
	const [listPanelOpen, setListPanelOpen] = useSessionStorageState<boolean>('combinationHistoryListOpen', {
		listenStorageChange: true,
		defaultValue: true
	})

	const toggleListPanelOpen = useMemoizedFn(() => {
		setListPanelOpen((prev) => !prev)
	})

	return { listPanelOpen, toggleListPanelOpen }
}
