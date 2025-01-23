import { routeTree } from '@/route-tree.gen'
import { Link, ParseRoute } from '@tanstack/react-router'
import { createContext, use, useMemo, useState } from 'react'

export type TBreadcrumb = {
	to: ParseRoute<typeof routeTree>['fullPath']
	text: string
	params?: React.ComponentProps<typeof Link>['params']
	search?: React.ComponentProps<typeof Link>['search']
}

type TBreadcrumbContext = {
	breadcrumb: TBreadcrumb[]
	setBreadcrumb: React.Dispatch<React.SetStateAction<TBreadcrumb[]>>
}

export const BreadcrumbContext = createContext<TBreadcrumbContext>({
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

export const useBreadcrumbContext = () => use(BreadcrumbContext)
