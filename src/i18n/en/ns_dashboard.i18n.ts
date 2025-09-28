export default {
	compare_from_last_month: '{{value}} from last month',
	dashboard_description:
		'Providing an overview of key metrics, including statistics and inbound/outbound operations and more.',
	net_flow_description: 'Net flow (inflow - outflow balance) of the warehouse over time.',
	inoutbound_overview: 'Inbound/Outbound overview',
	assembly_productivity_overview: 'Assembly productivity overview',
	assembly_productivity_description: 'Showing productivity of each customer brands',
	period_options: {
		last_3_months: 'Last 3 months',
		last_30_days: 'Last 30 days',
		last_7_days: 'Last 7 days'
	},
	statistic: {
		order_number: 'Total of orders',
		inventory_number: 'Inventory number',
		inbound_quantity: 'Inbound quantity',
		outbound_quantity: 'Outbound quantity',
		net_flow: 'Net flow',
		defective_rate: 'Defective rate'
	},
	comparison: {
		// Basic trend descriptions
		increase: 'increase',
		decrease: 'decrease',
		no_change: 'no change',
		trend_up: 'upward trend',
		trend_down: 'downward trend',
		trend_stable: 'stable trend',

		// Detailed change descriptions
		significantly_increased_by: 'Significantly increased by {{count}} ({{unit}}) compared to previous period',
		significantly_decreased_by: 'Significantly decreased by {{count}} ({{unit}}) compared to previous period',
		slightly_increased_by: 'Slightly increased by {{count}} ({{unit}}) compared to previous period',
		slightly_decreased_by: 'Slightly decreased by {{count}} ({{unit}}) compared to previous period',
		increased_by: 'Increased by {{count}} ({{unit}})',
		decreased_by: 'Decreased by {{count}} ({{unit}})',
		changed_by: 'Changed by {{count}} {{unit}}',
		remained_unchanged: 'no change versus prior period',

		// Comparative phrases
		higher_than_last_month: 'Higher than last month',
		lower_than_last_month: 'Lower than last month',
		same_as_last_month: 'Same as last month',
		compared_to_previous_period: 'compared to previous period',
		from_previous_month: 'vs previous month',

		// Status descriptions
		performance_improved: 'performance improved',
		performance_declined: 'performance declined',
		maintaining_steady_performance: 'performance holding steady',

		// Granular change intensity levels
		increase_minimal: 'minimal increase',
		increase_slight: 'slight increase',
		increase_moderate: 'moderate increase',
		increase_notable: 'notable increase',
		increase_strong: 'strong increase',
		increase_sharp: 'sharp increase',
		increase_surge: 'surge',
		increase_exceptional: 'exceptional increase',

		decrease_minimal: 'minimal decrease',
		decrease_slight: 'slight decrease',
		decrease_moderate: 'moderate decrease',
		decrease_notable: 'notable decrease',
		decrease_strong: 'strong decrease',
		decrease_sharp: 'sharp decrease',
		decrease_drop: 'drop',
		decrease_exceptional: 'exceptional decrease',

		// Percentage helpers
		pct_up: 'up {{percent}}%',
		pct_down: 'down {{percent}}%',
		pct_flat: '< 1% change'
	}
} as const
