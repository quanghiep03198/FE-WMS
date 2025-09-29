export default {
	compare_from_last_month: '{{value}} 与上月比较',
	dashboard_description: '提供关键指标的概览，包括统计数据和入出库操作',
	inoutbound_overview: '入库/出库概览',
	net_flow_description: '仓库过去6个月的净流量 (入库-出库平衡)',
	assembly_productivity_overview: '装配生产力概览',
	assembly_productivity_description: '显示各客户品牌的生产效率',
	// inventory_turnover_description: '显示过去12个月的库存周转率',
	period_options: {
		last_3_months: '最近3个月',
		last_30_days: '最近30天',
		last_7_days: '最近7天'
	},
	statistic: {
		order_number: '订单总量',
		inventory_number: '库存总量',
		inbound_quantity: '入库总量',
		outbound_quantity: '出库总量',
		inventory_turnover: '库存周转率',
		net_flow: '净流量',
		defective_rate: '次品率'
	},
	comparison: {
		// 基本趋势描述
		increase: '增长',
		decrease: '下降',
		no_change: '无变化',
		significant_trend_up_by: '本月显著上升趋势 {{percent}}%',
		significant_trend_down_by: '本月显著下降趋势 {{percent}}%',
		slight_trend_up_by: '本月轻微上升趋势 {{percent}}%',
		slight_trend_down_by: '本月轻微下降趋势 {{percent}}%',

		// 详细变化描述
		significantly_increased_by: '较上期增长 {{count}} ({{unit}}) 单位',
		significantly_decreased_by: '较上期减少 {{count}} ({{unit}}) 单位',
		slightly_increased_by: '较上期轻微增长 {{count}} ({{unit}}) 单位',
		slightly_decreased_by: '较上期轻微减少 {{count}} ({{unit}}) 单位',
		increased_by: '增长 {{count}} ({{unit}})',
		decreased_by: '减少 {{count}} ({{unit}})',
		changed_by: '变化 {{count}} ({{unit}})',
		remained_unchanged: '与上期相比无变化',

		// 比较短语
		higher_than_last_month: '高于上月',
		lower_than_last_month: '低于上月',
		same_as_last_month: '与上月相同',
		compared_to_previous_period: '与上期相比',
		from_previous_month: '与上月比',

		// 状态描述
		performance_improved: '绩效改善',
		performance_declined: '绩效下降',
		maintaining_steady_performance: '保持稳定绩效',

		// 详细变化等级
		increase_minimal: '轻微增长',
		increase_slight: '小幅增长',
		increase_moderate: '适度增长',
		increase_notable: '显著增长',
		increase_strong: '强劲增长',
		increase_sharp: '急剧增长',
		increase_surge: '激增',
		increase_exceptional: '异常增长',

		decrease_minimal: '轻微下降',
		decrease_slight: '小幅下降',
		decrease_moderate: '适度下降',
		decrease_notable: '显著下降',
		decrease_strong: '强烈下降',
		decrease_sharp: '急剧下降',
		decrease_drop: '暴跌',
		decrease_exceptional: '异常下降',

		// 百分比助手
		pct_up: '上升 {{percent}}%',
		pct_down: '下降 {{percent}}%',
		pct_flat: '变化 < 1%'
	}
} as const
