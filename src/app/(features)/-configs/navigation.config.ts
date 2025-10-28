import { IconProps } from '@/components/ui'
import { FileRouteTypes } from '@/route-tree.gen'
import { ResourceKeys } from 'i18next'

export type NavigationConfig = {
	icon?: IconProps['name']
	title: ResourceKeys['ns_common']
	url?: FileRouteTypes['to']
	keybinding?: string
	items?: Omit<NavigationConfig, 'icon'>[]
}

export const navigationConfig: Record<'main' | 'preferences' | 'admin_dashboard', NavigationConfig[]> = {
	main: [
		{
			icon: 'Gauge',
			title: 'navigation.dashboard',
			url: '/dashboard'
		},
		{
			icon: 'LayoutList',
			title: 'navigation.common_management',
			items: [
				{
					title: 'navigation.warehouse_management',
					url: '/warehouse'
				},
				{
					title: 'navigation.rfid_device_management',
					url: '/rfid-devices-management'
				}
			]
		},
		{
			icon: 'Blocks',
			title: 'navigation.rfid_system',
			items: [
				{
					title: 'navigation.finished_goods_inbound',
					url: '/finished-goods-inbound'
				},
				{
					title: 'navigation.finished_goods_outbound',
					url: '/finished-goods-outbound'
				},
				{
					title: 'navigation.defective_goods_epc_combination',
					url: '/defective-goods-epc-combination'
				},
				{
					title: 'navigation.defective_goods_inoutbound',
					url: '/defective-goods-inoutbound'
				}
			]
		},
		{
			title: 'navigation.report_management',
			icon: 'Files',
			items: [
				{
					title: 'navigation.daily_inbound_report',
					url: '/inbound-report'
				},
				{
					title: 'navigation.daily_outbound_report',
					url: '/outbound-report'
				},

				{
					title: 'navigation.monthly_inventory_audit',
					url: '/inventory-audit'
				},
				{
					title: 'navigation.inventory_estimation',
					url: '/production-inventory'
				},
				{
					title: 'navigation.defective_goods_inventory',
					url: '/defective-goods-inventory'
				},
				{
					title: 'navigation.cargo_weight_check',
					url: '/cargo-weight-check'
				}
			]
		},
		{
			title: 'navigation.seeking',
			icon: 'FileSearch',
			items: [
				{
					title: 'navigation.inoutbound_history',
					url: '/inoutbound-history'
				},
				{
					title: 'navigation.purchase_order_search',
					url: '/purchase-order-seeking'
				},
				{
					title: 'navigation.packing_manifest',
					url: '/packing-manifest'
				}
			]
		}
	],
	preferences: [
		{
			icon: 'CircleUserRound',
			title: 'navigation.account',
			url: '/preferences/account',
			keybinding: 'ctrl.alt.a'
		},
		{
			icon: 'Keyboard',
			title: 'navigation.keyboard_shortcut',
			url: '/preferences/keybindings',
			keybinding: 'alt.shift.k'
		},
		{
			icon: 'Settings',
			title: 'navigation.settings',
			url: '/preferences/appearance-settings',
			keybinding: 'ctrl.alt.s'
		}
	],
	admin_dashboard: [
		{
			icon: 'User',
			title: 'navigation.dashboard',
			url: '/admin/user-management'
		}
	]
}
