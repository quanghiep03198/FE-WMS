import { TIconProps } from '@/components/ui'
import { Link } from '@tanstack/react-router'
import { KeyType } from 'ahooks/lib/useKeyPress'
import { ResourceKeys } from 'i18next'
import { Trans } from 'react-i18next'

type TNavigationTitle = ResourceKeys<false>

export type NavigationConfig = {
	id: number
	icon: TIconProps['name']
	title: ResourceKeys['ns_common']
	path: React.ComponentProps<typeof Link>['to']
	type: 'main' | 'preference' | 'auth'
	keybinding: KeyType
}

export const navigationConfig: NavigationConfig[] = [
	{
		id: 1,
		icon: 'LayoutDashboard',
		title: 'navigation.wh_dashboard',
		path: '/dashboard',
		type: 'main',
		keybinding: 'ctrl.alt.1'
	},
	{
		id: 2,
		icon: 'Warehouse',
		title: 'navigation.wh_management',
		path: '/warehouse',
		type: 'main',
		keybinding: 'ctrl.alt.2'
	},
	{
		id: 3,
		icon: 'GitPullRequestArrow',
		title: 'navigation.wh_import_management',
		path: '/warehouse-import',
		type: 'main',
		keybinding: 'ctrl.alt.3'
	},
	{
		id: 4,
		icon: 'GitBranch',
		title: 'navigation.wh_export_management',
		path: '/warehouse-export',
		type: 'main',
		keybinding: 'ctrl.alt.4'
	},
	{
		id: 5,
		icon: 'ShipWheel',
		title: 'navigation.wh_transfer_managment',
		path: '/transfer-management',
		type: 'main',
		keybinding: 'ctrl.alt.5'
	},
	{
		id: 6,
		icon: 'Package',
		title: 'navigation.wh_inventory_management',
		path: '/inventory',
		type: 'main',
		keybinding: 'ctrl.alt.6'
	},
	{
		id: 7,
		icon: 'ArrowLeftRight',
		title: 'navigation.wh_exchange_n_return_management',
		path: '/exchange-return',
		type: 'main',
		keybinding: 'ctrl.alt.7'
	},
	{
		id: 8,
		icon: 'FileText',
		title: 'navigation.wh_report_management',
		path: '/report',
		type: 'main',
		keybinding: 'ctrl.alt.8'
	},
	{
		id: 9,
		icon: 'User',
		title: 'navigation.profile',
		path: '/profile',
		type: 'preference',
		keybinding: 'ctrl.alt.p'
	},
	{
		id: 10,
		icon: 'CircleUserRound',
		title: 'navigation.account',
		path: '/account',
		type: 'preference',
		keybinding: 'ctrl.alt.p'
	},
	{
		id: 11,
		icon: 'Keyboard',
		title: 'navigation.keyboard_shortcut',
		path: '/keybindings',
		type: 'preference',
		keybinding: 'alt.shift.k'
	},
	{
		id: 12,
		icon: 'Settings',
		title: 'navigation.settings',
		path: '/appearance-settings',
		type: 'preference',
		keybinding: 'ctrl.alt.s'
	}
]
