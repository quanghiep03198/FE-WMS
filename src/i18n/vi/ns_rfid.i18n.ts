export default {
	descriptions: {
		deduplicate_epc: 'Chặn quét lặp các EPC đã lưu vào hệ thống trước đó.',
		device_name: 'Một tên duy nhất để nhận diện trạm trong hệ thống sản xuất.',
		device_sn: 'Số serial thường được tìm thấy trên nhãn dán ở mặt sau của thiết bị.',
		device_type: 'Chọn loại thiết bị để cấu hình các cài đặt phù hợp.',
		dialog_form: 'Vui lòng điền thông tin bên dưới để thêm hoặc cập nhật thông tin thiết bị RFID vào hệ thống.',
		rfid_device_management: 'Quản lý các thiết bị RFID sử dụng trong kho.'
	},
	fields: {
		device_name: 'Tên thiết bị',
		device_sn: 'Số serial thiết bị',
		device_type: 'Loại thiết bị',
		last_used_time: 'Thời gian sử dụng gần nhất',

		station_no: 'Số hiệu trạm sử dụng'
	},
	no_sync_process: 'Không có tiến trình đồng bộ đang hoạt động',
	placeholders: {
		search_epc: 'Quét hoặc nhập EPC để tìm kiếm ...'
	},
	reader_settings_form: {
		description: `Bạn có thể chỉ định các chi tiết mạng của đầu đọc, chẳng hạn như địa chỉ IP của nó, để đảm bảo kết nối và chức năng đúng đắn.`,
		reader_ant: {
			description: 'Chọn số anten sẽ được sử dụng để đọc thẻ RFID.',

			label: 'A'
		},
		reader_ip: {
			description:
				'Nhập địa chỉ IP của đầu đọc RFID. Địa chỉ này nên có định dạng của một địa chỉ IPv4 hợp lệ (loại A).',

			label: 'Địa chỉ IP đầu đọc'
		},
		reader_power: {
			description:
				'Điều chỉnh mức công suất của đầu đọc RFID (5-30 dBm). Mức công suất cao hơn có thể tăng phạm vi đọc nhưng cũng có thể dẫn đến đọc các EPC không mong muốn.',

			label: 'Công suất đầu đọc'
		},
		sync_settings: {
			description: 'Nhấn nút "Đồng bộ cài đặt" sẽ lấy các cài đặt mới nhất từ thiết bị đầu đọc RFID.',

			title: 'Đồng bộ cài đặt'
		},

		title: 'Cài đặt đầu đọc RFID'
	},

	recently_use: 'Sử dụng gần đây',
	rfid_agent_connection_failure: {
		description:
			'Hãy chắc chắn rằng máy tính của bạn đã cài đặt đồng thời đang sử dụng RFID Agent và các thông số cài đặt thiết bị RFID đều chính xác.',

		title: 'Không thể kết nối với RFID Agent'
	},
	status: {
		scannable: 'Có thể quét',
		scanned: 'Đã quét',
		unscannable: 'Không thể quét',
		unscanned: 'Chưa quét'
	},
	sync_data_steps: {
		step_1: 'Xác thực Deckers API',
		step_2: 'Lấy dữ liệu các đơn hàng và thông tin của EPC',
		step_3: 'Cập nhật thông tin cho các EPC',
		step_4: 'Hoàn thành'
	},
	titles: {
		add_device: 'Thêm thiết bị',
		deduplicate_epc: 'Chặn quét lặp',
		edit_device: 'Chỉnh sửa thông tin thiết bị',
		rfid_device_management: 'Quản lý thiết bị RFID',
		watching: 'Đang theo dõi'
	},
	use_rfid_device: 'Sử dụng thiết bị cầm tay'
}
