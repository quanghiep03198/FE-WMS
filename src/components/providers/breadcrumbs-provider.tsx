import { routeTree } from '@/route-tree.gen'
import { AnyPathParams, ParsePathParams, ParseRoute } from '@tanstack/react-router'
import { ResourceKeys } from 'i18next'
import React, { createContext, useState } from 'react'

export type TBreadcrumb = {
	href: ParseRoute<typeof routeTree>['fullPath']
	title?: string
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
