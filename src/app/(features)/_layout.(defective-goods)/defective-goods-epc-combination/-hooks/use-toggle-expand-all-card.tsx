import { useLocalStorageState } from 'ahooks'
import { useTransition } from 'react'

export const useToggleExpandAllCards = () => {
	const [isAllCardsExpanded, setIsAllCardsExpanded] = useLocalStorageState<boolean>('expandAllDefectiveGoodsCards', {
		defaultValue: true,
		listenStorageChange: true
	})

	const [isToggling, startTransition] = useTransition()

	const toggleAllCardExpaned = () => startTransition(() => setIsAllCardsExpanded(!isAllCardsExpanded))

	return { isAllCardsExpanded, isToggling, setIsAllCardsExpanded, toggleAllCardExpaned }
}
