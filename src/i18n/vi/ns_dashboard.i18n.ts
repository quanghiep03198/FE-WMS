export default {
	compare_from_last_month: '{{value}} so với tháng trước',
	dashboard_description:
		'Cung cấp số liệu tổng quan về các chỉ số chính, bao gồm thống kê và hoạt động nhập/xuất kho và các hoạt động khác',
	inoutbound_overview: 'Tổng quan nhập/xuất kho',
	net_flow_description:
		'Dòng chảy ròng hàng hóa (chênh lệch giữa nhập và xuất của kho theo thời gian) trong 6 tháng vừa qua.',
	assembly_productivity_overview: 'Tổng quan sản lượng thành hình',
	assembly_productivity_description: 'Chi tiết sản lượng thành hình của các nhãn hàng.',
	period_options: {
		last_3_months: '3 tháng gần nhất',
		last_30_days: '30 ngày gần nhất',
		last_7_days: '7 ngày gần nhất'
	},
	statistic: {
		order_number: 'Số đơn hàng',
		inventory_number: 'Số lượng tồn kho',
		inbound_quantity: 'Số lượng nhập kho',
		outbound_quantity: 'Số lượng xuất kho',
		net_flow: 'Dòng hàng ròng',
		inventory_turnover: 'Vòng quay tồn kho',
		defective_rate: 'Tỷ lệ hàng lỗi'
	},
	comparison: {
		// Mô tả xu hướng cơ bản
		no_change: 'không thay đổi',
		significant_trend_up_by: 'Xu hướng tăng mạnh (+{{percent}}%) tháng này',
		significant_trend_down_by: 'Xu hướng giảm mạnh (-{{percent}}%) tháng này',
		slight_trend_up_by: 'Xu hướng tăng nhẹ (+{{percent}}%) tháng này',
		slight_trend_down_by: 'Xu hướng giảm nhẹ (-{{percent}}%) tháng này',
		trend_stable: 'Xu hướng ổn định',

		// Mô tả thay đổi chi tiết
		significantly_increased_by: 'Tăng mạnh ({{count}} {{unit}}) so với kỳ trước',
		significantly_decreased_by: 'Giảm mạnh ({{count}} {{unit}}) so với kỳ trước',
		slightly_increased_by: 'Tăng nhẹ ({{count}} {{unit}}) so với kỳ trước',
		slightly_decreased_by: 'Giảm nhẹ ({{count}} {{unit}}) so với kỳ trước',
		increased_by: 'Tăng {{count}} ({{unit}})',
		decreased_by: 'Giảm {{count}} ({{unit}})',
		changed_by: 'Thay đổi {{count}} ({{unit}})',
		remained_unchanged: 'Không thay đổi so với kỳ trước',

		// Cụm từ so sánh
		higher_than_last_month: 'Cao hơn tháng trước',
		lower_than_last_month: 'Thấp hơn tháng trước',
		same_as_last_month: 'Bằng với tháng trước',

		// Mô tả trạng thái
		performance_improved: 'Hiệu suất được cải thiện',
		performance_declined: 'Hiệu suất giảm sút',
		maintaining_steady_performance: 'Duy trì hiệu suất ổn định',

		// Cấp độ thay đổi chi tiết
		increase_minimal: 'Tăng tối thiểu',
		increase_slight: 'Tăng nhẹ',
		increase_moderate: 'Tăng vừa phải',
		increase_notable: 'Tăng đáng kể',
		increase_strong: 'Tăng mạnh',
		increase_sharp: 'Tăng đột biến',
		increase_surge: 'Tăng vọt',
		increase_exceptional: 'Tăng đặc biệt',

		decrease_minimal: 'Giảm tối thiểu',
		decrease_slight: 'Giảm nhẹ',
		decrease_moderate: 'Giảm vừa phải',
		decrease_notable: 'Giảm đáng kể',
		decrease_strong: 'Giảm mạnh',
		decrease_sharp: 'Giảm đột ngột',
		decrease_drop: 'Sụt giảm',
		decrease_exceptional: 'Giảm đặc biệt',

		// Trợ giúp phần trăm
		pct_up: 'tăng {{percent}}%',
		pct_down: 'giảm {{percent}}%',
		pct_flat: 'thay đổi < 1%'
	}
} as const
