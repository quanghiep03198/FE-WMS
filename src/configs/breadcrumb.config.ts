import { ResourceKeys } from 'i18next'

export type TBreadcrumb = { href: string; title: ResourceKeys['ns_common'] }

export const breadcrumbs: Record<string, TBreadcrumb[]> = {
	'/dashboard': [{ href: '/dashboard', title: 'navigation.wh_dashboard' }],
	'/warehouse': [{ href: '/warehouse', title: 'navigation.wh_management' }],
	'/transfer-management': [{ href: '/transfer-management', title: 'navigation.wh_transfer_managment' }],
	'/warehouse-import': [{ href: '/warehouse-import', title: 'navigation.wh_dashboard' }],
	'/warehouse-export': [{ href: '/warehouse-export', title: 'navigation.wh_dashboard' }],
	'/inventory': [{ href: '/inventory', title: 'navigation.wh_inventory_management' }],
	'/report': [{ href: '/report', title: 'navigation.wh_report_management' }],
	'/exchange-return': [{ href: '/exchange-return', title: 'navigation.wh_exchange_n_return_management' }]
}
