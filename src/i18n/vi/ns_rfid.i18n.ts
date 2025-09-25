export default {
	no_sync_process: 'Không có tiến trình đồng bộ đang hoạt động',
	use_rfid_device: 'Sử dụng thiết bị cầm tay',
	fields: {
		device_sn: 'Số serial thiết bị',
		station_no: 'Số hiệu trạm sử dụng',
		device_name: 'Tên thiết bị',
		device_type: 'Loại thiết bị',
		last_used_time: 'Thời gian sử dụng gần nhất'
	},
	titles: {
		add_device: 'Thêm thiết bị',
		edit_device: 'Chỉnh sửa thông tin thiết bị'
	},
	descriptions: {
		dialog_form: 'Vui lòng điền thông tin bên dưới để thêm hoặc cập nhật thông tin thiết bị RFID vào hệ thống.',
		device_sn: 'Số serial thường được tìm thấy trên nhãn dán ở mặt sau của thiết bị.',
		device_name: 'Một tên duy nhất để nhận diện trạm trong hệ thống sản xuất.',
		device_type: 'Chọn loại thiết bị để cấu hình các cài đặt phù hợp.'
	},
	recently_use: 'Sử dụng gần đây',
	sync_data_steps: {
		step_1: 'Xác thực Decker API',
		step_2: 'Lấy dữ liệu các đơn hàng và thông tin của EPC',
		step_3: 'Cập nhật thông tin cho các EPC',
		step_4: 'Hoàn thành Job'
	},
	placeholders: {
		search_epc: 'Quét hoặc nhập EPC để tìm kiếm ...'
	},
	status: {
		scannable: 'Có thể quét',
		scanned: 'Đã quét',
		unscannable: 'Không thể quét',
		unscanned: 'Chưa quét'
	},
	rfid_agent_connection_failure: {
		title: 'Không thể kết nối với RFID Agent',
		description:
			'Hãy chắc chắn rằng máy tính của bạn đã cài đặt đồng thời đang sử dụng RFID Agent và các thông số cài đặt thiết bị RFID đều chính xác.'
	},
	reader_settings_form: {
		title: 'Cài đặt đầu đọc RFID',
		description: `Bạn có thể chỉ định các chi tiết mạng của đầu đọc, chẳng hạn như địa chỉ IP của nó, để đảm bảo kết nối và chức năng đúng đắn.`,
		reader_ip: {
			label: 'Địa chỉ IP đầu đọc',
			description:
				'Nhập địa chỉ IP của đầu đọc RFID. Địa chỉ này nên có định dạng của một địa chỉ IPv4 hợp lệ (loại A).'
		},
		reader_ant: {
			label: 'A',
			description: 'Chọn số anten sẽ được sử dụng để đọc thẻ RFID.'
		},
		reader_power: {
			label: 'Công suất đầu đọc',
			description:
				'Điều chỉnh mức công suất của đầu đọc RFID (5-30 dBm). Mức công suất cao hơn có thể tăng phạm vi đọc nhưng cũng có thể dẫn đến đọc các EPC không mong muốn.'
		},
		sync_settings: {
			title: 'Đồng bộ cài đặt',
			description: 'Nhấn nút "Đồng bộ cài đặt" sẽ lấy các cài đặt mới nhất từ thiết bị đầu đọc RFID.'
		}
	}
}
