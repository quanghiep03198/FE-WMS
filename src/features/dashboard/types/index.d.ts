export interface IMonthlyInventoryComparison {
	comparison_date: string
	current_period: string
	previous_period: string
	curr_period_inventory_qty: number
	prev_period_inventory_qty: number
	curr_month_initial_qty: number
	curr_month_final_qty: number
	curr_month_inbound: number
	curr_month_outbound: number
	prev_month_initial_qty: number
	prev_month_inbound: number
	prev_month_outbound: number
	inventory_difference: number
	inventory_percentage_change: number
	inbound_difference: number
	inbound_percentage_change: number
	outbound_difference: number
	outbound_percentage_change: number
	curr_month_turnover: number
	prev_month_turnover: number
	inventory_turnover_difference: number
	turnover_percentage_change: number
}

export interface IAnnuallyInOutboundStatistics {
	year: number
	month: number
	inbound_qty: number
	outbound_qty: number
	net_flow: number
	inbound_outbound_ratio: number
	total_transactions: number
	period_range: string
}

export interface IAssemblyProductionVolumn {
	brand_name: string
	work_date: string
	volumn: number
}
