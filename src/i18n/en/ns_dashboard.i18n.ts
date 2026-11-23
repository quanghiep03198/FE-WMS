export default {
	all_time_defective_goods_inventory_qty: 'Latest total defective inventory based on stock count.',
	assembly_productivity_description: 'Illustrate productivity of each customer brands.',
	assembly_productivity_overview: 'Assembly line production volumn',
	compare_from_last_month: '{{value}} from last month',
	comparison: {
		changed_by: 'Changed by {{count}} {{unit}}',
		decrease: 'Decrease',
		decrease_drop: 'Drop',
		decrease_exceptional: 'Exceptional decrease',

		decrease_minimal: 'Minimal decrease',
		decrease_moderate: 'Moderate decrease',
		decrease_notable: 'Notable decrease',
		decrease_sharp: 'Sharp decrease',
		decrease_slight: 'Slight decrease',
		decrease_strong: 'Strong decrease',
		decreased_by: 'Decreased by {{count}} {{unit}}',

		higher_than_last_month: 'Higher than last month',
		increase: 'Increase',
		increase_exceptional: 'Exceptional increase',

		increase_minimal: 'Minimal increase',
		increase_moderate: 'Moderate increase',
		increase_notable: 'Notable increase',
		increase_sharp: 'Sharp increase',
		increase_slight: 'Slight increase',
		increase_strong: 'Strong increase',
		increase_surge: 'Surge',
		increased_by: 'Increased by {{count}} {{unit}}',
		lower_than_last_month: 'Lower than last month',
		maintaining_steady_performance: 'Performance holding steady',
		no_change: 'No change',
		pct_down: 'Down {{percent}}%',
		pct_flat: '< 1% change',

		pct_up: 'Up {{percent}}%',
		performance_declined: 'Performance declined',

		performance_improved: 'Performance improved',
		remained_unchanged: 'No change versus prior period',
		same_as_last_month: 'Same as last month',
		significant_trend_down_by: 'Significant downward trend -{{percent}}% this month',
		significant_trend_up_by: 'Significant upward trend +{{percent}}% this month',
		significantly_decreased_by: 'Significantly decreased by {{count}} ({{unit}}) compared to previous period',

		significantly_increased_by: 'Significantly increased by {{count}} ({{unit}}) compared to previous period',
		slight_trend_down_by: 'Slight downward trend -{{percent}}% this month',
		slight_trend_up_by: 'Slight upward trend +{{percent}}% this month',
		slightly_decreased_by: 'Slightly decreased by {{count}} ({{unit}}) compared to previous period',
		slightly_increased_by: 'Slightly increased by {{count}} ({{unit}}) compared to previous period',
		trend_stable: 'Stable trend'
	},

	dashboard_description:
		'Providing an overview of key metrics including statistics, analysis, inbound/outbound operations and more.',
	defective_goods_inventory_overview: 'Defective goods inventory overview',
	defective_goods_inventory_overview_description: 'Breakdown of defective goods inventory by category.',
	inoutbound_overview: 'Inbound/Outbound overview',
	net_flow_description: 'Net flow (inflow - outflow balance) of the warehouse last 6 months.',
	period_options: {
		last_3_months: 'Last 3 months',
		last_30_days: 'Last 30 days',
		last_7_days: 'Last 7 days'
	},
	statistic: {
		defective_rate: 'Defective rate',

		inbound_quantity: 'Inbound quantity',
		inventory_number: 'Inventory quantity',
		inventory_turnover: 'Inventory turnover',
		net_flow: 'Net Flow',
		order_number: 'Total of orders',
		outbound_quantity: 'Outbound quantity'
	}
} as const
