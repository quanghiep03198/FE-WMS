export interface IInOutBoundReport {
	mo_no: string
	mat_code: string
	factory_shoes_style: string | null
	order_qty: number
	factory_code_produce: string
	color_sn: string
	accumulated_qty: number
	variation_details: Array<{
		size_numcode: string
		qty: number
	}>
}

export interface IInboundReport extends IInOutBoundReport {
	assembly_lines: Array<string>
	storage_locations: Array<string>
	daily_inbound_qty: number
}

export interface IOutboundReport extends Omit<IInOutBoundReport, 'size_data'> {
	po: string
	missing_qty: number
	daily_outbound_qty: number
	detail: Array<{
		mo_no: string
		color_sn: string
		sizes: Array<{
			size_numcode: string
			qty: number
		}>
	}>
	overall: Array<{ size_numcode: string; po_size_qty: number; daily_qty: number; missing_qty: number }>
}
export interface IInboundHistory {
	factory_code_produce: string
	mo_no: string
	brand_name: string
	factory_shoes_style: string
	// cust_shoes_style: string
	color_sn: string
	order_qty: number
	accumulated_inbound_qty: number
	recalled_qty: number
	missing_qty: number
	progress: `${number}%`
	// order_size_run: Array<{
	// 	size_numcode: string
	// 	qty: number
	// }>
	// inbound_history_by_size: Array<{
	// 	size_numcode: string
	// 	qty: number
	// }>
	daily_inbound_history: Array<{
		mo_no: string
		date: string
		inventory_variation: Record<
			string,
			{
				stocked_in_qty: number
				total_recall_tx: number
				total_return_tx: number
				shipped_out_qty: number
			}
		>
	}>
	inventory_variation: Record<
		string,
		{
			order_qty: number
			stocked_in_qty: number
			total_recall_tx: number
			total_return_tx: number
			shipped_out_qty: number
		}
	>
	// progress: `${number}%`
}

export interface IOutboundHistory {
	po: string
	po_qty: number
	accumulated_outbound_qty: number
	missing_qty: number
	brand_name: string
	factory_shoes_style: string
	cust_shoes_style: string
	color_sn: string
	outbound_history: Array<{
		outbound_date: string
		mo_no: string
		sizes: Array<{
			size_numcode: string
			qty: number
		}>
	}>
	overall: Array<{
		size_numcode: string
		po_size_qty: number
		acc_qty: number
		missing_qty: number
	}>
	progress: `${number}%`
}
