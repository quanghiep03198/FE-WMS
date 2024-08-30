import { ResourceKeys } from 'i18next'

export const InoutboundOrderTypes = {
	'inventory_list_type.finished_goods_dispatch': 'A',
	'inventory_list_type.finished_goods_receipt': 'B',
	'inventory_list_type.outbound_shipment_receipt': 'C',
	'inventory_list_type.inbound_shipment_receipt': 'D'
} as Record<ResourceKeys['ns_erp'], 'A' | 'B' | 'C' | 'D'>
