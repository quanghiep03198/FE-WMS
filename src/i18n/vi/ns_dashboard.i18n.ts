export default {
	all_time_defective_goods_inventory_qty: 'Tổng số lượng tồn kho được cập nhật theo kiểm kê mới nhất.',
	assembly_productivity_description: 'Chi tiết sản lượng thành hình của các nhãn hàng.',
	assembly_productivity_overview: 'Tổng Quan Sản Lượng Thành Phẩm',
	compare_from_last_month: '{{value}} so với tháng trước',
	comparison: {
		changed_by: 'Thay đổi {{count}} ({{unit}})',
		decrease_drop: 'Sụt giảm',
		decrease_exceptional: 'Giảm đặc biệt',

		decrease_minimal: 'Giảm tối thiểu',
		decrease_moderate: 'Giảm vừa phải',
		decrease_notable: 'Giảm đáng kể',
		decrease_sharp: 'Giảm đột ngột',
		decrease_slight: 'Giảm nhẹ',
		decrease_strong: 'Giảm mạnh',
		decreased_by: 'Giảm {{count}} ({{unit}})',

		// Cụm từ so sánh
		higher_than_last_month: 'Cao hơn tháng trước',
		increase_exceptional: 'Tăng đặc biệt',

		// Cấp độ thay đổi chi tiết
		increase_minimal: 'Tăng tối thiểu',
		increase_moderate: 'Tăng vừa phải',
		increase_notable: 'Tăng đáng kể',
		increase_sharp: 'Tăng đột biến',
		increase_slight: 'Tăng nhẹ',
		increase_strong: 'Tăng mạnh',
		increase_surge: 'Tăng vọt',
		increased_by: 'Tăng {{count}} ({{unit}})',
		lower_than_last_month: 'Thấp hơn tháng trước',
		maintaining_steady_performance: 'Duy trì hiệu suất ổn định',
		// Mô tả xu hướng cơ bản
		no_change: 'Không thay đổi',
		pct_down: 'Giảm {{percent}}%',
		pct_flat: 'Thay đổi < 1%',

		// Trợ giúp phần trăm
		pct_up: 'Tăng {{percent}}%',
		performance_declined: 'Hiệu suất giảm sút',

		// Mô tả trạng thái
		performance_improved: 'Hiệu suất được cải thiện',
		remained_unchanged: 'Không thay đổi so với kỳ trước',
		same_as_last_month: 'Bằng với tháng trước',
		significant_trend_down_by: 'Xu hướng giảm mạnh (-{{percent}}%) tháng này',
		significant_trend_up_by: 'Xu hướng tăng mạnh (+{{percent}}%) tháng này',
		significantly_decreased_by: 'Giảm mạnh ({{count}} {{unit}}) so với kỳ trước',

		// Mô tả thay đổi chi tiết
		significantly_increased_by: 'Tăng mạnh ({{count}} {{unit}}) so với kỳ trước',
		slight_trend_down_by: 'Xu hướng giảm nhẹ (-{{percent}}%) tháng này',
		slight_trend_up_by: 'Xu hướng tăng nhẹ (+{{percent}}%) tháng này',
		slightly_decreased_by: 'Giảm nhẹ ({{count}} {{unit}}) so với kỳ trước',
		slightly_increased_by: 'Tăng nhẹ ({{count}} {{unit}}) so với kỳ trước',
		trend_stable: 'Xu hướng ổn định'
	},

	dashboard_description:
		'Cung cấp số liệu tổng quan về các chỉ số chính, bao gồm thống kê và hoạt động nhập/xuất kho và các hoạt động khác.',
	defective_goods_inventory_overview: 'Tổng Quan Tồn Kho Hàng Lỗi',
	defective_goods_inventory_overview_description: 'Cơ cấu tồn kho hàng lỗi theo từng loại.',
	inoutbound_overview: 'Tổng Quan Nhập/Xuất Kho',
	net_flow_description:
		'Dòng chảy ròng hàng hóa (chênh lệch giữa nhập và xuất của kho theo thời gian) trong 6 tháng vừa qua.',
	period_options: {
		last_3_months: '3 tháng gần nhất',
		last_30_days: '30 ngày gần nhất',
		last_7_days: '7 ngày gần nhất'
	},
	statistic: {
		defective_rate: 'Tỷ lệ hàng lỗi',

		inbound_quantity: 'Số lượng nhập kho',
		inventory_number: 'Số lượng tồn kho',
		inventory_turnover: 'Vòng quay tồn kho',
		net_flow: 'Dòng hàng ròng',
		order_number: 'Số đơn hàng',
		outbound_quantity: 'Số lượng xuất kho'
	}
} as const
