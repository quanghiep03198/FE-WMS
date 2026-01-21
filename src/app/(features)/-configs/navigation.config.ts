import { UserRole } from '@/common/constants/enums'
import { IconProps } from '@/components/ui'
import { FileRouteTypes } from '@/route-tree.gen'
import { ResourceKeys } from 'i18next'

export type NavigationConfig = {
	icon?: IconProps['name']
	title: ResourceKeys['ns_common']
	url?: FileRouteTypes['to']
	keybinding?: string
	items?: Omit<NavigationConfig, 'icon'>[]
	authorizedRoles?: UserRole[] | '*'
}

export const navigationConfig: Record<'main' | 'preferences', NavigationConfig[]> = {
	main: [
		{
			icon: 'Gauge',
			title: 'navigation.dashboard',
			url: '/dashboard',
			authorizedRoles: [
				UserRole.ADMIN,
				UserRole.MANAGER,
				UserRole.WAREHOUSE_STAFF,
				UserRole.OPERATIONS_STAFF,
				UserRole.QUALITY_CONTROL_INSPECTOR
			]
		},
		{
			icon: 'LayoutList',
			title: 'navigation.common_management',
			items: [
				{
					title: 'navigation.warehouse_management',
					url: '/warehouse',
					authorizedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE_STAFF]
				},
				{
					title: 'navigation.rfid_device_management',
					url: '/rfid-devices-management',
					authorizedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE_STAFF]
				}
			]
		},
		{
			icon: 'Blocks',
			title: 'navigation.rfid_system',
			items: [
				{
					title: 'navigation.finished_goods_inbound',
					url: '/finished-goods-inbound',
					authorizedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE_STAFF]
				},
				{
					title: 'navigation.finished_goods_outbound',
					url: '/finished-goods-outbound',
					authorizedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE_STAFF]
				},
				{
					title: 'navigation.defective_goods_epc_combination',
					url: '/defective-goods-epc-combination',
					authorizedRoles: [
						UserRole.ADMIN,
						UserRole.MANAGER,
						UserRole.WAREHOUSE_STAFF,
						UserRole.QUALITY_CONTROL_INSPECTOR
					]
				},
				{
					title: 'navigation.defective_goods_inoutbound',
					url: '/defective-goods-inoutbound',
					authorizedRoles: [
						UserRole.ADMIN,
						UserRole.MANAGER,
						UserRole.WAREHOUSE_STAFF,
						UserRole.QUALITY_CONTROL_INSPECTOR
					]
				}
			]
		},
		{
			title: 'navigation.report_management',
			icon: 'Files',
			items: [
				{
					title: 'navigation.daily_inbound_report',
					url: '/inbound-report',
					authorizedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE_STAFF]
				},
				{
					title: 'navigation.daily_outbound_report',
					url: '/outbound-report',
					authorizedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE_STAFF]
				},

				{
					title: 'navigation.monthly_inventory_audit',
					url: '/inventory-audit',
					authorizedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE_STAFF]
				},
				{
					title: 'navigation.inventory_estimation',
					url: '/production-inventory',
					authorizedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE_STAFF]
				},
				{
					title: 'navigation.defective_goods_inbound_report',
					url: '/defective-goods-inbound-report',
					authorizedRoles: [
						UserRole.ADMIN,
						UserRole.MANAGER,
						UserRole.WAREHOUSE_STAFF,
						UserRole.QUALITY_CONTROL_INSPECTOR
					]
				},
				{
					title: 'navigation.defective_goods_outbound_report',
					url: '/defective-goods-outbound-report',
					authorizedRoles: [
						UserRole.ADMIN,
						UserRole.MANAGER,
						UserRole.WAREHOUSE_STAFF,
						UserRole.QUALITY_CONTROL_INSPECTOR
					]
				},
				{
					title: 'navigation.defective_goods_inventory',
					url: '/defective-goods-inventory',
					authorizedRoles: [
						UserRole.ADMIN,
						UserRole.MANAGER,
						UserRole.WAREHOUSE_STAFF,
						UserRole.QUALITY_CONTROL_INSPECTOR
					]
				},
				{
					title: 'navigation.cargo_weight_check',
					url: '/cargo-weight-check',
					authorizedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE_STAFF]
				}
			]
		},
		{
			icon: 'Container',
			title: 'navigation.truckload_delivery_management',
			url: '/truckload-delivery',
			authorizedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE_STAFF]
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
			],
			authorizedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE_STAFF]
		}
	],
	preferences: [
		{
			icon: 'CircleUserRound',
			title: 'navigation.account',
			url: '/preferences/account',
			keybinding: 'ctrl.alt.a',
			authorizedRoles: '*'
		},
		{
			icon: 'Keyboard',
			title: 'navigation.keyboard_shortcut',
			url: '/preferences/keybindings',
			keybinding: 'alt.shift.k',
			authorizedRoles: '*'
		},
		{
			icon: 'Settings',
			title: 'navigation.settings',
			url: '/preferences/appearance-settings',
			keybinding: 'ctrl.alt.s',
			authorizedRoles: '*'
		}
	]
}
