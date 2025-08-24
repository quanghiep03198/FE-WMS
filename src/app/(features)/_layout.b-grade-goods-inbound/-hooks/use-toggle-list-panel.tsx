import { useMemoizedFn, useSessionStorageState } from 'ahooks'

export const useToggleListPanel = () => {
	const [listPanelOpen, setListPanelOpen] = useSessionStorageState<boolean>('b-grade-list-panel-open', {
		listenStorageChange: true,
		defaultValue: true
	})

	const toggleListPanelOpen = useMemoizedFn(() => {
		setListPanelOpen((prev) => !prev)
	})

	return { listPanelOpen, toggleListPanelOpen }
}
