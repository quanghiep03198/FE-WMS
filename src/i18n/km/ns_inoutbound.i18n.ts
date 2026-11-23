import { OrderStatus } from '@common/constants/enums'
import { DefectiveGoodsSource } from '@features/defective-goods/constants/enums'

export default {
	action_types: {
		recall: 'ប្រមូលត្រឡប់',
		stock_in: 'ទទួលចូលស្តុក',
		stock_out: 'ដកចេញពីស្តុក'
	},
	counter_box: {
		caption: 'ទិន្នន័យនឹងបន្តបញ្ជូននៅពេលការតភ្ជាប់ត្រូវបានបង្កើត។',
		label: 'EPC ដែលបានស្កេន'
	},
	description: {
		add_outbound_size: 'បន្ថែមទំហំ និងបរិមាណសម្រាប់បញ្ជាទិញនេះ ដើម្បីអនុវត្តប្រតិបត្តិការចេញ។',
		archived_restoration: 'ស្តារទិន្នន័យក្នុងប័ណ្ណសារឡើងវិញ។ ប្រើតែនៅពេលចាំបាច់។',
		close_monthly_inventory: 'តើអ្នកប្រាកដថាចង់បិទស្តុកប្រចាំខែឬទេ? បន្ទាប់ពីបិទ អ្នកនឹងមិនអាចកែប្រែព័ត៌មានស្តុកសម្រាប់ខែនេះបានទេ។',
		confirm_dispatch_order_info: 'បញ្ជាក់ថាព័ត៌មានបញ្ជូនទំនិញត្រឹមត្រូវ និងអនុញ្ញាតឱ្យទំនិញចេញពីរោងចក្រ។',
		container_condition_assessment: 'សូមជ្រើសរើសចំណុចទាំងអស់ដែលអនុវត្តចំពោះស្ថានភាពកុងតឺន័រ (ប្រសិនបើមាន)',
		container_number_field: 'ទម្រង់លេខកូដកុងតឺន័រ BIC។ រំលងវាលនេះ ប្រសិនបើមិនមានលេខកុងតឺន័រនៅពេលនេះ។',
		create_truckload_delivery: 'បង្កើតព័ត៌មានផ្ទុកកុងតឺន័រថ្មីសម្រាប់ការដឹកទំនិញចេញពីរោងចក្រ',
		current_stock_transaction: 'មើលប្រតិបត្តិការស្តុកបច្ចុប្បន្នសម្រាប់លំហូរស្តុកដែលបានជ្រើសរើស។',
		daily_inbound_report: 'មើលទិន្នន័យ EPC ដែលបានស្កេន និងអនុវត្តប្រតិបត្តិការទទួលទំនិញចូលឃ្លាំងប្រចាំថ្ងៃ។',
		daily_outbound_report: 'មើលទិន្នន័យ EPC ដែលបានស្កេន និងអនុវត្តប្រតិបត្តិការចេញទំនិញពីឃ្លាំងប្រចាំថ្ងៃ។',
		defective_epc_caption: 'ចុចលើវាលបញ្ចូលនេះ ហើយស្កេនស្លាក EPC របស់ទំនិញខូច។ EPC ត្រូវមាន 24 តួអក្សរ។',
		defective_goods_inbound_report: 'គ្រប់គ្រង និងតាមដានការទទួលទំនិញខូចចូលឃ្លាំង។',
		defective_goods_inventory_report: 'គ្រប់គ្រង និងតាមដានស្តុកទំនិញខូចក្នុងឃ្លាំង។',
		defective_goods_outbound_report: 'គ្រប់គ្រង និងតាមដានការចេញទំនិញខូចពីឃ្លាំង។',
		duplicate_po_added: 'កុំបន្ថែមបញ្ជាទិញស្ទួន ហើយបរិមាណចេញមិនត្រូវលើសបរិមាណបញ្ជាទិញសរុបឡើយ។',
		empty_defect_item_caption: 'រកមិនឃើញទំនិញខូចទេ។ សូមបន្ថែមទំនិញខូចទៅក្នុងបញ្ជីដោយប្រើទម្រង់នៅក្បែរ។',
		exchange_all: 'អ្នកអាចប្តូរ EPC ទាំងអស់ដែលជាកម្មសិទ្ធិរបស់ទំហំដែលបានជ្រើសរើស។',
		exchange_epc_dialog_desc: 'អនុញ្ញាតឱ្យអ្នកប្រើជំនួស ឬធ្វើបច្ចុប្បន្នភាពស្លាក EPC លើផលិតផលដោយប្រើបញ្ជាផលិតកម្មថ្មី។',
		inbound_directive: 'សេចក្តីណែនាំទទួលចូល',
		inbound_history_lookup: 'មើលប្រវត្តិទទួលចូល ព័ត៌មានលម្អិតបញ្ជាផលិតកម្ម និងបរិមាណទទួលប្រចាំថ្ងៃ។',
		inoutbound_form_note: 'បញ្ឈប់ការអានពីឧបករណ៍ RFID និងផ្តាច់ការតភ្ជាប់ មុនពេលធ្វើបច្ចុប្បន្នភាពចលនាស្តុក។',
		inoutbound_history_lookup: 'ពិនិត្យព័ត៌មាន និងប្រវត្តិបរិមាណទទួល/ចេញតាមបញ្ជាទិញ',
		inoutbound_history_not_found: 'រកមិនឃើញប្រវត្តិទទួល/ចេញសម្រាប់បញ្ជាទិញនេះទេ។ សូមពិនិត្យលេខកូដបញ្ជាទិញដែលអ្នកបានបញ្ចូល។',
		inoutbound_table_caption: 'តារាងខាងលើសង្ខេបទិន្នន័យ EPC ដែលបានស្កេន។',
		inventory_audit: 'សវនកម្មស្តុកឃ្លាំង',
		inventory_audit_desc: 'បញ្ជីសេចក្តីណែនាំទទួលចូលតាមប្រភេទផលិតផលនីមួយៗ',
		inventory_by_size: 'ស្តុកតាមទំហំ',
		inventory_by_size_desc: 'ព័ត៌មានបរិមាណផលិតផលតាមទំហំនីមួយៗ',
		inventory_estimation: 'ប៉ាន់ប្រមាណកម្រិតស្តុកដោយផ្អែកលើស្ថានភាពផលិតកម្ម និងដឹកជញ្ជូនបច្ចុប្បន្ន។',
		license_plate_field: 'ស្លាកលេខរថយន្តដែលត្រូវនឹងលេខកុងតឺន័រ។ អាចរំលងការបញ្ចូលស្លាកលេខ ប្រសិនបើមិនស្គាល់លេខកុងតឺន័រ។',
		list_of_already_scanned_epcs: 'បញ្ជី EPC ដែលបានស្កេនទទួលចូលពីមុន។',
		monthly_inventory_report: 'គ្រប់គ្រង និងតាមដានស្តុកប្រចាំខែនៃទំនិញសម្រេចក្នុងឃ្លាំង។',
		no_added_size: 'មិនទាន់បានបន្ថែមទំហំ',
		no_dispatch_order_item_added: 'មិនទាន់បានបន្ថែមទំនិញក្នុងបញ្ជាបញ្ជូន',
		no_dispatch_order_item_added_caption: 'សូមបន្ថែមបញ្ជាទិញយ៉ាងតិចមួយ និងបរិមាណចេញ មុននឹងបន្ត។',
		no_exchangable_order: 'អាចប្តូរបានតែទំនិញដែលមានលេខកូដផលិតកម្ម និងលេខទំហំដូចគ្នាប៉ុណ្ណោះ។',
		order_size_detail: 'មើលព័ត៌មានលម្អិតនៃបរិមាណតាមទំហំសម្រាប់បញ្ជាផលិតកម្ម។ អ្នកអាចប្តូរ EPC ប្រសិនបើចាំបាច់។',
		order_sizing_list: 'តារាងខាងក្រោមបង្ហាញព័ត៌មានទំហំរបស់បញ្ជាទិញដែលបានស្កេន។',
		outbound_estimation: 'បរិមាណចេញដែលបានប៉ាន់ប្រមាណសម្រាប់បញ្ជាទិញ',
		outbound_history_lookup: 'ពិនិត្យប្រវត្តិចេញ ព័ត៌មានបញ្ជាទិញ និងបរិមាណដឹកចេញប្រចាំថ្ងៃ។',
		outbound_order_estimation: 'ការវាយតម្លៃវឌ្ឍនភាពចេញទំនិញ',
		outbound_order_estimation_desc: 'វាយតម្លៃវឌ្ឍនភាពចេញរបស់ PO នីមួយៗ ដោយផ្អែកលើចំនួនស្លាកដែលបានស្កេន។',
		request_change_dispatch_order_info:
			'រកឃើញភាពខុសគ្នានៃព័ត៌មានដឹកជញ្ជូន។ ផ្នែកនាំចូល-នាំចេញ និងបុគ្គលិកឃ្លាំងត្រូវធ្វើបច្ចុប្បន្នភាពកំណត់ត្រា។',
		rollback_stock_transaction: 'បន្ទាប់ពីត្រឡប់ប្រតិបត្តិការនេះ បរិមាណស្តុកនឹងត្រឡប់ទៅស្ថានភាពមុន។ តើអ្នកប្រាកដថាចង់បន្តឬទេ?',
		seal_number_field: 'លេខត្រាដែលត្រូវនឹងលេខកុងតឺន័រ។ អាចរំលងការបញ្ចូលលេខត្រា ប្រសិនបើមិនស្គាល់លេខកុងតឺន័រ។',
		select_order: 'ជ្រើសរើសបញ្ជាផលិតកម្ម ដើម្បីមើលទិន្នន័យ EPC ដែលបានស្កេន និងអនុវត្តប្រតិបត្តិការទទួល ឬចេញពីឃ្លាំង។',
		size_qty_caption: 'បរិមាណផលិតផលសរុបតាមទំហំ',
		transferred_order: 'លេខកូដបញ្ជាទិញពិតប្រាកដដែលត្រូវប្តូរ។',
		truckload_delivery: 'គ្រប់គ្រងព័ត៌មានផ្ទុកកុងតឺន័រសម្រាប់ការដឹកទំនិញចេញពីរោងចក្រ',
		update_dispatch_order_signature_info: 'ធ្វើបច្ចុប្បន្នភាពហត្ថលេខាបញ្ជាក់ព័ត៌មានបញ្ជូនទំនិញ',
		update_truckload_delivery: 'ធ្វើបច្ចុប្បន្នភាពព័ត៌មានផ្ទុកកុងតឺន័រសម្រាប់ការដឹកទំនិញចេញពីរោងចក្រ'
	},
	inoutbound_actions: {
		close_monthly_inventory: 'បិទស្តុក',
		downgrade: 'បន្ថយពីថ្នាក់ B ទៅ C',
		giveaway: 'ផ្តល់ជូន',
		lab: 'មន្ទីរពិសោធន៍',
		normal_export: 'នាំចេញធម្មតា',
		normal_import: 'នាំចូលធម្មតា',
		recycle: 'កែច្នៃឡើងវិញ',
		return_for_repair: 'ប្រគល់ត្រឡប់ដើម្បីជួសជុល',
		ruin: 'ខូចខាត',
		scrap: 'សំណល់',
		shipping: 'ដឹកជញ្ជូន',
		transfer_inbound: 'ផ្ទេរចូល',
		transfer_outbound: 'ផ្ទេរចេញ'
	},
	labels: {
		delete_all: 'លុបទាំងអស់',
		delete_and_unscannable: 'លុប ហើយកុំស្កេនឡើងវិញ',
		exchange_all: 'ប្តូរទាំងអស់',
		inoutbound_method: 'វិធីសាស្ត្រទទួល/ចេញ',
		io_archive_warehouse: 'ឃ្លាំងប័ណ្ណសារ',
		io_storage_location: 'ទីតាំងផ្ទុក',
		security_confirmation: 'ការបញ្ជាក់ពីសន្តិសុខ',
		signature: 'ហត្ថលេខា'
	},
	mo_no_box: {
		caption: 'អ្នកអាចកំណត់ថាតើបញ្ជាទិញណាមួយគួរប្រើសម្រាប់នាំចូល/នាំចេញ។'
	},
	notification: {
		already_inbound_epcs: 'រកឃើញ EPC ដែលបានស្កេនទទួលចូលពីមុន។ សូមពិនិត្យព័ត៌មានលម្អិត និងជូនដំណឹងដល់ផ្នែកបង្កើតទម្រង់។',
		browser_tab_resumed: 'សូមស្វាគមន៍ត្រឡប់មកវិញ',
		browser_tab_resumed_message: 'ដោយសារអសកម្ម ការតភ្ជាប់ត្រូវបានបិទជាបណ្តោះអាសន្ន ដើម្បីសន្សំធនធានប្រព័ន្ធ។ តើអ្នកចង់ភ្ជាប់ឡើងវិញឬទេ?',
		confirm_delete_all_mono: {
			description: 'ប្រសិនបើអ្នកលុបវា អ្នកត្រូវស្កេន EPC ឡើងវិញ។',
			title: 'តើអ្នកចង់លុបបញ្ជាទិញនេះឬទេ?'
		},
		exchange_order_caution: 'មិនអាចត្រឡប់សកម្មភាពប្តូរបញ្ជាផលិតកម្មវិញបានទេ។ សូមបញ្ជាក់ការផ្លាស់ប្តូរមុនពេលបន្ត។',
		invalid_epc_deteted: 'រកឃើញ EPC មិនត្រឹមត្រូវ។ សូមទាក់ទងផ្នែកបង្កើតទម្រង់ ហើយផ្ទេរវាទៅការកែច្នៃឡើងវិញ។',
		navigation_blocked_caption: 'មានកិច្ចការមិនទាន់រក្សាទុក។ តើអ្នកប្រាកដថាចង់ចាកចេញពីទំព័រឥឡូវនេះឬទេ?',
		navigation_blocked_message: 'តើនៅតែចង់បោះបង់ការស្កេន EPC ឬទេ?',
		posible_incorrect_po: 'លេខ PO ប្រហែលជាមិនត្រឹមត្រូវ។ តើអ្នកចង់បន្តរក្សាទុកឬទេ?',
		too_many_mono: 'បានស្កេនពាក្យបញ្ជាលើសពី 3។ សូមពិនិត្យម្តងទៀត។'
	},
	order_status: {
		[OrderStatus.NOT_APPROVED]: 'មិនទាន់អនុម័ត',
		[OrderStatus.APPROVED]: 'បានអនុម័ត',
		[OrderStatus.REAPPROVED]: 'បានអនុម័តឡើងវិញ',
		[OrderStatus.CANCELLED]: 'បានបោះបង់'
	},
	placeholders: {
		enter_storage_location: 'បញ្ចូលទីតាំងផ្ទុក...',
		max_qty: 'អតិបរមា {{qty}} (គូ)',
		outbound_purpose: 'គោលបំណងចេញទំនិញ...',
		select_rfid_device: 'ជ្រើសរើសឧបករណ៍ RFID'
	},
	rfid_process: {
		cutting_inbound: 'ទទួលចូលផ្នែកកាត់',
		production_management_inbound: 'ទទួលចូលផ្នែកគ្រប់គ្រងផលិតកម្ម',
		shaping_inbound: 'ទទួលចូលផ្នែកបង្កើតទម្រង់'
	},
	scanner_setting: {
		cron_job: 'ស្ថានភាពកិច្ចការ',
		data_restoration: 'ការស្តារទិន្នន័យ',
		data_restoration_note: 'ត្រឡប់ EPC ដែលបានលុប ដើម្បីស្តារវាទៅក្នុងស្តុក។',
		decker_data_synchronization: 'ការធ្វើសមកាលកម្មទិន្នន័យ Deckers',
		decker_data_synchronization_description: 'ជ្រើសរើសរោងចក្រដែលបញ្ជាផលិតកម្មមិនស្គាល់ជាកម្មសិទ្ធិរបស់វា',
		network_status: 'ស្ថានភាពបណ្តាញ',
		restore_deleted_epcs: 'ស្តារ EPC ដែលបានលុប',
		server_connection: 'ការតភ្ជាប់ម៉ាស៊ីនមេ',
		synchronization: 'ការធ្វើសមកាលកម្ម',
		toggle_fullscreen: 'បិទ/បើកពេញអេក្រង់',
		toggle_fullscreen_note: 'ប្រើទម្រង់ពេញអេក្រង់ ដើម្បីមើលបានធំជាងមុន។'
	},
	shoes_category: {
		b_grade: 'ថ្នាក់ B',
		c_grade: 'ថ្នាក់ C',
		research_development: 'ស្រាវជ្រាវ និងអភិវឌ្ឍន៍'
	},
	shoes_source: {
		[DefectiveGoodsSource.FINAL_INSPECTION]: 'ការត្រួតពិនិត្យចុងក្រោយ',
		[DefectiveGoodsSource.ASSEMBLY]: 'ការដំឡើង',
		[DefectiveGoodsSource.REPACKING]: 'ការវេចខ្ចប់ឡើងវិញ',
		[DefectiveGoodsSource.OVERRUN]: 'ផលិតលើស'
	},
	titles: {
		archived_restoration: 'ការស្តារប័ណ្ណសារ',
		close_monthly_inventory: 'បញ្ជាក់ការបិទស្តុកប្រចាំខែ?',
		combination_history: 'ប្រវត្តិការផ្គុំ',
		container_condition_assessment: 'ការវាយតម្លៃស្ថានភាពកុងតឺន័រ',
		create_truckload_delivery: 'បង្កើតការផ្ទុកទំនិញលើរថយន្ត',
		current_stock_transaction: 'ប្រតិបត្តិការស្តុកបច្ចុប្បន្ន',
		daily_inbound_report: 'របាយការណ៍ទទួលចូលប្រចាំថ្ងៃ',
		daily_outbound_report: 'របាយការណ៍ចេញប្រចាំថ្ងៃ',
		defective_goods_inventory_report: 'របាយការណ៍ស្តុកទំនិញខូច',
		dispatch_order_detail: 'ព័ត៌មានលម្អិតបញ្ជាបញ្ជូនទំនិញ',
		exchange_epc: 'ប្តូរ EPC',
		exchange_order: 'ប្តូរបញ្ជាផលិតកម្ម',
		file_daily_defective_goods_inbound_report: 'របាយការណ៍ទទួលទំនិញខូចប្រចាំថ្ងៃ {{factory}} - {{date}}',
		file_daily_defective_goods_outbound_report: 'របាយការណ៍ចេញទំនិញខូចប្រចាំថ្ងៃ {{factory}} - {{date}}',
		file_daily_inbound_report: 'របាយការណ៍ទទួលចូលប្រចាំថ្ងៃ {{factory}} - {{date}}',
		file_daily_outbound_report: 'របាយការណ៍ចេញប្រចាំថ្ងៃ {{factory}} - {{date}}',
		file_defective_goods_inventory_report: 'ស្តុកទំនិញខូច - {{factory}}',
		file_monthly_inventory_report: 'របាយការណ៍ស្តុកប្រចាំខែ {{factory}} - {{month}}',
		file_production_inventory_summary: 'សង្ខេបស្តុកផលិតកម្ម - {{factory}}',
		file_truckload_delivery_report: 'របាយការណ៍ផ្ទុកទំនិញលើរថយន្តឃ្លាំង - {{factory}}',
		inbound_history: 'ប្រវត្តិទទួលចូល',
		inoutbound_history_lookup: 'ស្វែងរកប្រវត្តិទទួល/ចេញ',
		monthly_inventory_report: 'របាយការណ៍ស្តុកប្រចាំខែ',
		order_sizing_list: 'បញ្ជីទំហំបញ្ជាទិញ',
		outbound_history: 'ប្រវត្តិចេញ',
		production_inventory_summary: 'សង្ខេបស្តុកផលិតកម្ម',
		rollback_stock_transaction: 'ត្រឡប់ប្រតិបត្តិការនេះមែនទេ?',
		update_truckload_delivery: 'ធ្វើបច្ចុប្បន្នភាពការផ្ទុកទំនិញលើរថយន្ត'
	}
}
