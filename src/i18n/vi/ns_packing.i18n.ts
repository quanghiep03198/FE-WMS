export default {
	manifest: {
		pending: 'Đang chờ xuất Excel',
		processing: 'Đang tạo Excel',
		done: 'Xuất Excel hoàn tất',
		ready: 'File Excel đã sẵn sàng, đang bắt đầu tải xuống.',
		retry_download: 'Tải xuống',
		failed: 'Xuất Excel thất bại',
		expired: 'File xuất đã hết hạn. Vui lòng tạo lại.',
		progress: 'Tiến độ xuất Excel',
		download: 'Tải Excel',
		too_many: 'Đang có tác vụ xuất. Vui lòng đợi tác vụ hoàn tất.',
		create_error: 'Không thể bắt đầu xuất Excel.',
		status_error: 'Không thể kiểm tra trạng thái xuất.',
		retry: 'Thử lại',
		list_error: 'Không thể tải bảng kê đóng gói.'
	},
	titles: {
		packing_manifest: 'Bảng kê đóng gói',
		daily_weighing_report: 'Báo biểu cân hàng hàng ngày',
		file_daily_weighing_report: 'Báo biểu cân hàng {{factory}} - {{date}}',
		file_packing_manifest: 'Bảng kê đóng gói {{factory}}'
	},
	descriptions: {
		packing_manifest: 'Chi tiết các lô hàng đã được đóng gói và sẵn sàng để vận chuyển',
		daily_weighing_report: 'Thông tin lô hàng đã kiểm tra và cân trên hệ thống cân điện tử'
	}
}
