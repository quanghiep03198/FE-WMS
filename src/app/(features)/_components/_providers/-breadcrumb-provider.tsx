import { routeTree } from '@/route-tree.gen'
import { AnyPathParams, ParseRoute } from '@tanstack/react-router'
import React, { createContext, useState } from 'react'

export type TBreadcrumb = {
	to: ParseRoute<typeof routeTree>['fullPath']
	title: string
	params?: AnyPathParams
}

export const BreadcrumbContext = createContext<{
	breadcrumb: TBreadcrumb[]
	setBreadcrumb: React.Dispatch<React.SetStateAction<TBreadcrumb[]>>
}>({
	breadcrumb: [],
	setBreadcrumb: () => undefined
})

export const BreadcrumbProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [breadcrumb, setBreadcrumb] = useState<TBreadcrumb[]>([])

	return <BreadcrumbContext.Provider value={{ breadcrumb, setBreadcrumb }}>{children}</BreadcrumbContext.Provider>
}
