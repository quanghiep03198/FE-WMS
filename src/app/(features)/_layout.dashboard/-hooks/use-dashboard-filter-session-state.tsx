import { useSessionStorageState } from 'ahooks'
import { format, subMonths } from 'date-fns'

const DASHBOARD_FILTER_KEY = 'dashboardFilters'

export const useDashboardFilterSessionState = () => {
	return useSessionStorageState<{
		inoutboundOverviewYear: number
		assemblyProductivityOverview: string
	}>(DASHBOARD_FILTER_KEY, {
		listenStorageChange: true,
		defaultValue: {
			inoutboundOverviewYear: new Date().getFullYear(),
			assemblyProductivityOverview: format(subMonths(new Date(), 3), 'yyyy-MM-dd')
		}
	})
}
