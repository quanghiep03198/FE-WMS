export default {
	devices: 'RFID设备',
	devices_description: '当前仓库中的RFID设备列表',
	no_sync_process: '没有同步进程正在运行',
	use_rfid_device: '使用手持机',
	placeholders: {
		search_epc: '扫描或输入EPC以搜索 ...'
	},
	sync_data_steps: {
		step_1: '验证 Decker API',
		step_2: '获取订单和 EPC 数据',
		step_3: '更新 EPC 数据',
		step_4: '完成 Job'
	},
	status: {
		scannable: '可扫描',
		scanned: '已扫描',
		unscannable: '不可扫描',
		unscanned: '未扫描'
	},
	rfid_agent_connection_failure: {
		title: '不能链接 RFID Agent',
		description: '请确保您的电脑已安装并正在运行RFID Agent, 并且RFID设备的各项参数设置均正确.'
	},
	reader_settings_form: {
		title: '设置 RFID',
		description: '可以指定读写器的网络详细信息, 例如其IP地址, 以确保连接和功能的正常运行',
		reader_ip: {
			label: '读写器IP地址',
			description: '请输入RFID读写器的IP地址. 该地址应为有效的IPv4地址 (A类).'
		},
		reader_ant: {
			label: 'Antenna',
			description: '请选择用于读取RFID标签的天线数量.'
		},
		reader_power: {
			label: '机器功率',
			description: '调节RFID读器的功率水平 (5-30 dBm). 较高的功率可以增加读取范围, 但也可能导致读取到不需要的EPC.'
		},
		sync_settings: {
			title: '同步设置',
			description: '点击"同步设置"按钮, 将从RFID读写器获取最新的设置'
		}
	}
}
