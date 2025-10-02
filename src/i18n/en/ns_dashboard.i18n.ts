export default {
	all_time_defective_goods_inventory_qty: 'Latest total defective inventory based on stock count.',
	compare_from_last_month: '{{value}} from last month',
	dashboard_description:
		'Providing an overview of key metrics including statistics, analysis, inbound/outbound operations and more.',
	net_flow_description: 'Net flow (inflow - outflow balance) of the warehouse last 6 months.',
	inoutbound_overview: 'Inbound/Outbound overview',
	assembly_productivity_overview: 'Assembly line production volumn',
	assembly_productivity_description: 'Illustrate productivity of each customer brands.',
	defective_goods_inventory_overview: 'Defective goods inventory overview',
	defective_goods_inventory_overview_description: 'Breakdown of defective goods inventory by category.',
	period_options: {
		last_3_months: 'Last 3 months',
		last_30_days: 'Last 30 days',
		last_7_days: 'Last 7 days'
	},
	statistic: {
		order_number: 'Total of orders',
		inventory_number: 'Inventory quantity',
		inbound_quantity: 'Inbound quantity',
		outbound_quantity: 'Outbound quantity',
		inventory_turnover: 'Inventory turnover',
		net_flow: 'Net Flow',
		defective_rate: 'Defective rate'
	},
	comparison: {
		increase: 'Increase',
		decrease: 'Decrease',
		no_change: 'No change',
		significant_trend_up_by: 'Significant upward trend +{{percent}}% this month',
		significant_trend_down_by: 'Significant downward trend -{{percent}}% this month',
		slight_trend_up_by: 'Slight upward trend +{{percent}}% this month',
		slight_trend_down_by: 'Slight downward trend -{{percent}}% this month',
		trend_stable: 'Stable trend',

		significantly_increased_by: 'Significantly increased by {{count}} ({{unit}}) compared to previous period',
		significantly_decreased_by: 'Significantly decreased by {{count}} ({{unit}}) compared to previous period',
		slightly_increased_by: 'Slightly increased by {{count}} ({{unit}}) compared to previous period',
		slightly_decreased_by: 'Slightly decreased by {{count}} ({{unit}}) compared to previous period',
		increased_by: 'Increased by {{count}} {{unit}}',
		decreased_by: 'Decreased by {{count}} {{unit}}',
		changed_by: 'Changed by {{count}} {{unit}}',
		remained_unchanged: 'No change versus prior period',

		higher_than_last_month: 'Higher than last month',
		lower_than_last_month: 'Lower than last month',
		same_as_last_month: 'Same as last month',

		performance_improved: 'Performance improved',
		performance_declined: 'Performance declined',
		maintaining_steady_performance: 'Performance holding steady',

		increase_minimal: 'Minimal increase',
		increase_slight: 'Slight increase',
		increase_moderate: 'Moderate increase',
		increase_notable: 'Notable increase',
		increase_strong: 'Strong increase',
		increase_sharp: 'Sharp increase',
		increase_surge: 'Surge',
		increase_exceptional: 'Exceptional increase',

		decrease_minimal: 'Minimal decrease',
		decrease_slight: 'Slight decrease',
		decrease_moderate: 'Moderate decrease',
		decrease_notable: 'Notable decrease',
		decrease_strong: 'Strong decrease',
		decrease_sharp: 'Sharp decrease',
		decrease_drop: 'Drop',
		decrease_exceptional: 'Exceptional decrease',

		pct_up: 'Up {{percent}}%',
		pct_down: 'Down {{percent}}%',
		pct_flat: '< 1% change'
	}
} as const
