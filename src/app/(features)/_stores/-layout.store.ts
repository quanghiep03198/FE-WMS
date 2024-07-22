import { routeTree } from '@/route-tree.gen'
import { AnyPathParams, ParseRoute } from '@tanstack/react-router'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type TBreadcrumb = {
	to: ParseRoute<typeof routeTree>['fullPath']
	text: string
	params?: AnyPathParams
	search?: Record<string, any>
}

type LayoutState = {
	breadcrumb: TBreadcrumb[]
	navSidebarOpen: boolean
	setBreadcrumb: (data: TBreadcrumb[]) => void
	toggleNavSidebarOpen: () => void
}

export const useLayoutStore = create<LayoutState>()(
	immer((set) => ({
		breadcrumb: [],
		setBreadcrumb: (data) => set(() => ({ breadcrumb: data })),
		navSidebarOpen: false,
		toggleNavSidebarOpen: () => set((state) => ({ navSidebarOpen: !state.navSidebarOpen }))
	}))
)
