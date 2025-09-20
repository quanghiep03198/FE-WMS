import { useMemoizedFn, useSessionStorageState } from 'ahooks'

const PERSISTENT_LIST_OPEN_STATE_STORAGE_KEY = 'combinationHistoryListOpen'

export const useToggleListPanel = () => {
	const [listPanelOpen, setListPanelOpen] = useSessionStorageState<boolean>(PERSISTENT_LIST_OPEN_STATE_STORAGE_KEY, {
		listenStorageChange: true,
		defaultValue: true
	})

	const toggleListPanelOpen = useMemoizedFn(() => {
		setListPanelOpen((prev) => !prev)
	})

	return { listPanelOpen, toggleListPanelOpen }
}
