import { IconProps } from '@/components/ui'
import { routeTree } from '@/route-tree.gen'
import { ParseRoute } from '@tanstack/react-router'
import { KeyType } from 'ahooks/lib/useKeyPress'
import { ResourceKeys } from 'i18next'
import { v4 as uuidv4 } from 'uuid'

export type NavigationConfig = {
	id: string
	icon: IconProps['name']
	title: ResourceKeys['ns_common']
	path: ParseRoute<typeof routeTree>['fullPath']
	type: 'main' | 'preference' | 'auth'
	keybinding: KeyType
	children?: NavigationConfig[]
}

export const navigationConfig: NavigationConfig[] = [
	{
		id: uuidv4(),
		icon: 'LayoutDashboard',
		title: 'navigation.dashboard',
		path: '/dashboard',
		type: 'main',
		keybinding: 'ctrl.0'
	},
	{
		id: uuidv4(),
		icon: 'Warehouse',
		title: 'navigation.warehouse_management',
		path: '/warehouse',
		type: 'main',
		keybinding: 'ctrl.1'
	},
	{
		id: uuidv4(),
		icon: 'GitCompareArrows',
		title: 'navigation.fm_inoutbound',
		path: '/finished-production-inoutbound',
		type: 'main',
		keybinding: 'ctrl.2'
	},
	{
		id: uuidv4(),
		icon: 'BaggageClaim',
		title: 'navigation.pm_inbound',
		path: '/production-management-inbound',
		type: 'main',
		keybinding: 'ctrl.3'
	},

	{
		id: uuidv4(),
		icon: 'GitPullRequestArrow',
		title: 'navigation.import_management',
		path: '/warehouse-import',
		type: 'main',
		keybinding: 'ctrl.4'
	},
	{
		id: uuidv4(),
		icon: 'GitBranch',
		title: 'navigation.export_management',
		path: '/warehouse-export',
		type: 'main',
		keybinding: 'ctrl.5'
	},
	{
		id: uuidv4(),
		icon: 'ArrowRightLeft',
		title: 'navigation.transfer_managment',
		path: '/transfer-management',
		type: 'main',
		keybinding: 'ctrl.6'
	},
	{
		id: uuidv4(),
		icon: 'Container',
		title: 'navigation.inventory_management',
		path: '/inventory',
		type: 'main',
		keybinding: 'ctrl.7'
	},
	{
		id: uuidv4(),
		icon: 'PackageCheck',
		title: 'navigation.production_incoming_inspection',
		path: '/product-incoming-inspection',
		type: 'main',
		keybinding: 'ctrl.8'
	},
	{
		id: uuidv4(),
		icon: 'FileText',
		title: 'navigation.report_management',
		path: '/report',
		type: 'main',
		keybinding: 'ctrl.9'
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
		type: 'preference',
		keybinding: 'ctrl.alt.s'
	}
]
