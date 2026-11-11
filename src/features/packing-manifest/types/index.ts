export interface IPackingReport {
	brand_name: string
	po: string
	factory_shoes_style: string
	color_sn: string
	packing_standard: string
	po_qty: number
	target_box_qty: number
	target_item_qty: number
	weighed_box_qty: number
	unweighed_box_qty: number
}

export interface IPackingManifest extends Omit<IPackingReport, 'color_sn' | 'factory_shoes_style'> {
	shoes_style: string
	original_size_data: string
	color: string
	standard_weight: number
	actual_avg_weight: number | null
	factory_code_produce: string
}

export interface PackingManifestRow {
	po: string | null
	brand_name: string | null
	factory_shoes_style: string | null
	cust_shoes_style: string
	color_sn: string | null
	packing_standard: string | null
	original_size_data: string
	factory_code_produce: string
	standard_weight: number | null
	actual_avg_weight: number | null
	target_box_qty: number
	target_item_qty: number | null
	weighed_box_qty: number
	unweighed_box_qty: number
}

export interface PackingManifestPage {
	items: PackingManifestRow[]
	total: number
	page: number
	pageSize: number
}

export interface ManifestExportStatus {
	status: 'pending' | 'processing' | 'done' | 'failed' | 'expired'
	processedRows: number
	totalRows: number
	expiresAt?: string
	error?: string
}
