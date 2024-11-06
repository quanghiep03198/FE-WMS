import { routeTree } from '@/route-tree.gen'
import { AnyPathParams, ParseRoute } from '@tanstack/react-router'
import { createContext, useContext, useMemo, useState } from 'react'

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
	const [_breadcrumb, _setBreadcrumb] = useState<TBreadcrumb[]>([])

	const contextValues = useMemo(
		() => ({ breadcrumb: _breadcrumb, setBreadcrumb: _setBreadcrumb }),
		[_breadcrumb, _setBreadcrumb]
	)

	return <BreadcrumbContext.Provider value={contextValues}>{children}</BreadcrumbContext.Provider>
}

export const useBreadcrumbContext = () => useContext(BreadcrumbContext)
