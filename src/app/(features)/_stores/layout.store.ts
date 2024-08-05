import { BreakPoints } from '@/common/constants/enums'
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
	sidebarExpanded: boolean
	setBreadcrumb: (data: TBreadcrumb[]) => void
	toggleExpandSidebar: () => void
}

export const useLayoutStore = create<LayoutState>()(
	immer((set) => ({
		breadcrumb: [],
		setBreadcrumb: (data) => set(() => ({ breadcrumb: data })),
		sidebarExpanded: window.matchMedia(BreakPoints.EXTRA_LARGE).matches,
		toggleExpandSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded }))
	}))
)
