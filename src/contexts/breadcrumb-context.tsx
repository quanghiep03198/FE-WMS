import type { Link } from '@tanstack/react-router'
import { createContext, use, useMemo, useState } from 'react'
import type { FileRouteTypes, FileRoutesByTo } from '../route-tree.gen'

export type TBreadcrumb<T extends FileRouteTypes['fullPaths']> = {
	to: T
	text: string
	params?: ReturnType<FileRoutesByTo[T]['useParams']>
	search?: React.ComponentProps<typeof Link>['search']
}

type TBreadcrumbContext<T extends FileRouteTypes['fullPaths']> = {
	breadcrumb: TBreadcrumb<T>[]
	setBreadcrumb: React.Dispatch<React.SetStateAction<TBreadcrumb<T>[]>>
}

export const BreadcrumbContext = createContext<TBreadcrumbContext<FileRouteTypes['fullPaths']>>({
	breadcrumb: [],
	setBreadcrumb: () => undefined
})

export function BreadcrumbProvider({ children }: React.PropsWithChildren) {
	const [_breadcrumb, _setBreadcrumb] = useState<TBreadcrumb<FileRouteTypes['fullPaths']>[]>([])

	const contextValues: TBreadcrumbContext<FileRouteTypes['fullPaths']> = useMemo(
		() => ({ breadcrumb: _breadcrumb, setBreadcrumb: _setBreadcrumb }),
		[_breadcrumb, _setBreadcrumb]
	)

	return <BreadcrumbContext.Provider value={contextValues}>{children}</BreadcrumbContext.Provider>
}

export const useBreadcrumbContext = () => use(BreadcrumbContext)
