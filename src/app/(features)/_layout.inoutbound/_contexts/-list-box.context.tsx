import React, { createContext, useContext, useState } from 'react'

type TListBoxContext = {
	page: number | null
	setPage: React.Dispatch<React.SetStateAction<number>>
	loading: boolean
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const ListBoxContext = createContext<TListBoxContext>(null)

export const ListBoxProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [page, setPage] = useState<number>(null)
	const [loading, setLoading] = useState<boolean>(false)

	return <ListBoxContext.Provider value={{ page, setPage, loading, setLoading }}>{children}</ListBoxContext.Provider>
}

export const useListBoxContext = () => useContext(ListBoxContext)
