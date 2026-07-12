export interface IPackingReport {
	brand_name: string
	po: string
	factory_shoes_style: string
	color_sn: string
	size_data: string
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
