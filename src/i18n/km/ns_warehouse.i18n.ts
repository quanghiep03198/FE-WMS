export default {
	fields: {
		area: 'ផ្ទៃក្រឡា (ម²)',
		is_default: 'លំនាំដើម',
		is_disable: 'បានបិទ',
		manager: 'អ្នកគ្រប់គ្រង',
		new_storage_location: 'ទីតាំងផ្ទុកថ្មី',
		new_warehouse: 'ឃ្លាំងថ្មី',
		original_storage_location: 'ទីតាំងផ្ទុកដើម',
		original_warehouse: 'ឃ្លាំងដើម',
		storage_capacity: 'សមត្ថភាពផ្ទុក',
		storage_name: 'ឈ្មោះទីតាំងផ្ទុក',
		storage_num: 'លេខកូដទីតាំងផ្ទុក',
		storage_position: 'ទីតាំងផ្ទុក',
		total_number_of_storage: 'ចំនួនទីតាំងផ្ទុកសរុប',
		total_storage_capacity: 'សមត្ថភាពផ្ទុកសរុប',
		transfered_warehouse: 'ឃ្លាំងដែលបានផ្ទេរ',
		type_storage: 'ប្រភេទទីតាំងផ្ទុក',
		type_warehouse: 'ប្រភេទឃ្លាំង',
		warehouse_name: 'ឈ្មោះឃ្លាំង',
		warehouse_num: 'លេខកូដឃ្លាំង'
	},
	form: {
		add_storage_location_title: 'បន្ថែមទីតាំងផ្ទុកថ្មី',
		add_warehouse_title: 'បង្កើតឃ្លាំងថ្មី',
		storage_location_note: 'ឈ្មោះទីតាំងផ្ទុកត្រូវតែមានតែមួយគត់ និងមិនអាចដូចទីតាំងផ្សេងទៀតបានទេ។',
		update_storage_location_title: 'ធ្វើបច្ចុប្បន្នភាពទីតាំងផ្ទុក',
		update_warehouse_title: 'ធ្វើបច្ចុប្បន្នភាពឃ្លាំង'
	},
	headings: {
		storage_list_description: 'គ្រប់គ្រងព័ត៌មានទីតាំងផ្ទុក',
		storage_list_title: 'បញ្ជីទីតាំងផ្ទុក',
		warehouse_list_description: 'គ្រប់គ្រងព័ត៌មានឃ្លាំង',
		warehouse_list_title: 'បញ្ជីឃ្លាំង'
	},
	specialized_vocabs: {
		storage_area: 'តំបន់ផ្ទុក',
		warehouse: 'ឃ្លាំង'
	},
	storage_types: {
		finished_production_area: 'តំបន់ផលិតផលសម្រេច',
		inbound_staging_area: 'តំបន់រៀបចំទំនិញទទួលចូល',
		inspection_holding_area: 'តំបន់រង់ចាំត្រួតពិនិត្យផលិតផល',
		main_area: 'តំបន់សំខាន់',
		outbound_staging_area: 'តំបន់រៀបចំទំនិញចេញ'
	},
	tenancy_warehouse: {
		'201.202': 'ឃ្លាំងផលិតផលសម្រេចលានស៊ុនទី 2',
		'5.1': 'ឃ្លាំងផលិតផលសម្រេចកម្ពុជា',
		'80.2': 'ឃ្លាំងផលិតផលសម្រេចលានយីង'
	},
	warehouse_types: {
		finished_production_warehouse: 'ឃ្លាំងផលិតផលសម្រេច',
		half_finished_production: 'ឃ្លាំងផលិតផលពាក់កណ្តាលសម្រេច',
		material_warehouse: 'ឃ្លាំងសម្ភារៈ',
		production_warehouse: 'ឃ្លាំងផលិតកម្ម',
		scrap_production_warehouse: 'ឃ្លាំងសំណល់ផលិតកម្ម'
	}
} as const
