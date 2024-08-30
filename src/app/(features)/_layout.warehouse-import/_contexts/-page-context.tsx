import React, { createContext, useContext } from 'react'

type TPageContext = {
	orderCount: number
	setOrderCount: React.Dispatch<React.SetStateAction<number>>
	selectedStorage: string
	setSelectedStorage: React.Dispatch<React.SetStateAction<string>>
}

const PageContext = createContext<TPageContext>(null)

export const PageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [orderCount, setOrderCount] = React.useState(0)
	const [selectedStorage, setSelectedStorage] = React.useState(null)

	return (
		<PageContext.Provider value={{ orderCount, setOrderCount, selectedStorage, setSelectedStorage }}>
			{children}
		</PageContext.Provider>
	)
}

export const usePageContext = () => useContext(PageContext)
