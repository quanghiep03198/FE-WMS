import { IconProps } from '@/components/ui'
import { FileRouteTypes } from '@/route-tree.gen'
import { ResourceKeys } from 'i18next'
import { v4 as uuidv4 } from 'uuid'

export type NavigationConfig = {
	id: string
	icon: IconProps['name']
	title: ResourceKeys['ns_common']
	path: FileRouteTypes['to']
	status?: 'stable' | 'experimental' | 'deprecated'
	keybinding?: string
	type: 'main' | 'preference' | 'auth'
	children?: NavigationConfig[]
}

export const navigationConfig: NavigationConfig[] = [
	{
		id: uuidv4(),
		icon: 'LayoutDashboard',
		title: 'navigation.dashboard',
		path: '/dashboard',
		type: 'main'
	},
	{
		id: uuidv4(),
		icon: 'Warehouse',
		title: 'navigation.warehouse_management',
		path: '/warehouse',
		type: 'main',
		status: 'stable'
	},
	{
		id: uuidv4(),
		icon: 'Forklift',
		title: 'navigation.finished_goods_inbound',
		path: '/finished-goods-inbound',
		type: 'main'
	},
	{
		id: uuidv4(),
		icon: 'Truck',
		title: 'navigation.finished_goods_outbound',
		path: '/finished-goods-outbound',
		type: 'main'
	},
	{
		id: uuidv4(),
		icon: 'FileInput',
		title: 'navigation.import_management',
		path: '/inbound-report',
		type: 'main'
	},
	{
		id: uuidv4(),
		icon: 'FileOutput',
		title: 'navigation.export_management',
		path: '/outbound-report',
		type: 'main'
	},
	{
		id: uuidv4(),
		icon: 'FileSearch',
		title: 'navigation.inoutbound_history',
		path: '/inoutbound-history',
		type: 'main'
	},
	{
		id: uuidv4(),
		icon: 'Archive',
		title: 'navigation.monthly_inventory_audit',
		path: '/inventory-audit',
		type: 'main'
	},
	{
		id: uuidv4(),
		icon: 'Container',
		title: 'navigation.inventory_estimation',
		path: '/production-inventory',
		type: 'main'
	},
	{
		id: uuidv4(),
		icon: 'PackageCheck',
		title: 'navigation.cargo_weight_check',
		path: '/cargo-weight-check',
		type: 'main'
	},
	{
		id: uuidv4(),
		icon: 'ArrowRightLeft',
		title: 'navigation.transfer_managment',
		path: '/transfer-management',
		type: 'main'
	},
	{
		id: uuidv4(),
		icon: 'FileText',
		title: 'navigation.report_management',
		path: '/report',
		type: 'main'
	},
	{
		id: uuidv4(),
		icon: 'CircleUserRound',
		title: 'navigation.account',
		path: '/preferences/account',
		type: 'preference',
		keybinding: 'ctrl.alt.a'
	},
	{
		id: uuidv4(),
		icon: 'Keyboard',
		title: 'navigation.keyboard_shortcut',
		path: '/preferences/keybindings',
		type: 'preference',
		keybinding: 'alt.shift.k'
	},
	{
		id: uuidv4(),
		icon: 'Settings',
		title: 'navigation.settings',
		path: '/preferences/appearance-settings',
		keybinding: 'ctrl.alt.s',
		type: 'preference'
	}
]
