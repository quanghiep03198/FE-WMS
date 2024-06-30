export enum Theme {
	LIGHT = 'light',
	DARK = 'dark',
	SYSTEM = 'system'
}

export enum Languages {
	VIETNAMESE = 'vi',
	ENGLISH = 'en',
	CHINESE = 'cn'
}

export enum BreakPoints {
	SMALL = '(min-width: 320px) and (max-width: 599px)',
	MEDIUM = '(min-width: 600px) and (max-width: 1023px)',
	LARGE = '(min-width: 1024px) and (max-width: 1365px)',
	EXTRA_LARGE = '(min-width: 1366px)',
	ULTIMATE_LARGE = '(min-width: 1920px)'
}

export enum CommonActions {
	CREATE = 'CREATE',
	READ = 'READ',
	UPDATE = 'UPDATE',
	DELETE = 'DELETE',
	IMPORT = 'IMPORT',
	EXPORT = 'EXPORT'
}

export enum WarehouseTypes {
	PRODUCTION_WAREHOUSE = 'A',
	MATERIAL_WAREHOUSE = 'B',
	HALF_FINISHED_PRODUCTION = 'C',
	FINISHED_PRODUCTION_WAREHOUSE = 'D',
	SCRAP_PRODUCTION_WAREHOUSE = 'E'
}

export enum WarehouseStorageTypes {
	MAIN_AREA = 'A',
	FINISHED_PRODUCTION_AREA = 'B',
	INSPECTION_HOLDING_AREA = 'C',
	OUTBOUND_STAGING_AREA = 'D',
	INBOUND_STAGING_AREA = 'E'
}

export enum ProductionApproveStatus {
	NOT_REVIEWED = 'A',
	REVIEWED = 'B',
	PARTIALLY_REVIEWED = 'C',
	RE_REVIEW = 'D',
	REVIEW_CANCELLED = 'E'
}
