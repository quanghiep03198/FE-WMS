import { PropsWithChildren, WheelEventHandler, createContext, useRef, useState } from 'react'

type TableProviderProps = {
	hasNoFilter: boolean
} & PropsWithChildren

type TableContext = {
	isScrolling: boolean
	isFilterOpened: boolean
	handleMouseWheel: WheelEventHandler
	setIsFilterOpened: React.Dispatch<React.SetStateAction<boolean>>
} & Pick<TableProviderProps, 'hasNoFilter'>

export const TableContext = createContext<TableContext>({
	isScrolling: false,
	isFilterOpened: false,
	hasNoFilter: false,
	setIsFilterOpened: () => {},
	handleMouseWheel: () => undefined
})

export const TableProvider: React.FC<TableProviderProps> = ({ hasNoFilter, children }) => {
	const [isScrolling, setIsScrolling] = useState(false)
	const [isFilterOpened, setIsFilterOpened] = useState(false)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	const handleMouseWheel: WheelEventHandler = (e) => {
		e.stopPropagation()
		if (timeoutRef.current) clearTimeout(timeoutRef.current!)
		setIsScrolling(true)
		timeoutRef.current = setTimeout(() => {
			setIsScrolling(false)
		}, 100)
	}

	return (
		<TableContext.Provider
			value={{
				isScrolling,
				hasNoFilter,
				isFilterOpened,
				setIsFilterOpened,
				handleMouseWheel
			}}>
			{children}
		</TableContext.Provider>
	)
}
