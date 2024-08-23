import { routeTree } from '@/route-tree.gen'
import { AnyPathParams, ParseRoute } from '@tanstack/react-router'
import { createContext, useContext, useState } from 'react'

export type TBreadcrumb = {
	to: ParseRoute<typeof routeTree>['fullPath']
	text: string
	params?: AnyPathParams
	search?: Record<string, any>
}

type TBreadcrumbContext = {
	breadcrumb: TBreadcrumb[]
	setBreadcrumb: React.Dispatch<React.SetStateAction<TBreadcrumb[]>>
}

const BreadcrumbContext = createContext<TBreadcrumbContext>({
	breadcrumb: [],
	setBreadcrumb: () => undefined
})

export const BreadcrumbProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [breadcrumb, setBreadcrumb] = useState<TBreadcrumb[]>([])

	return <BreadcrumbContext.Provider value={{ breadcrumb, setBreadcrumb }}>{children}</BreadcrumbContext.Provider>
}

export const useBreadcrumbContext = () => useContext(BreadcrumbContext)
