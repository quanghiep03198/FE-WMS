export enum UserRole {
	/**
	 * @descrition Administrator
	 */
	ADMIN = 'ADMIN',
	/**
	 * @descrition Manager
	 */
	MANAGER = 'MANAGER',
	/**
	 * @descrition Import-Export Staff
	 */
	IE_STAFF = 'IE_STAFF',
	/**
	 * @descrition Finished Goods Warehouse Staff
	 */
	FG_WAREHOUSE_STAFF = 'FG_WAREHOUSE_STAFF',
	/**
	 * @descrition Defective Goods Warehouse Staff
	 */
	DG_WAREHOUSE_STAFF = 'DG_WAREHOUSE_STAFF',
	/**
	 * @descrition Security Guard
	 */
	SECURITY_GUARD = 'SECURITY_GUARD'
}

export enum Theme {
	LIGHT = 'light',
	DARK = 'dark',
	SYSTEM = 'system'
}

export enum RequestMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
	PATCH = 'PATCH',
	OPTIONS = 'OPTIONS',
	HEAD = 'HEAD',
	CONNECT = 'CONNECT'
}

export enum RequestHeaders {
	AUTHORIZATION = 'Authorization',
	ACCEPT_LANGUAGE = 'Accept-Language',
	API_VERSION = 'X-Api-Version',
	CONTENT_TYPE = 'Content-Type',
	TENANT_ID = 'X-Tenant-Id',
	FACTORY_CODE = 'X-User-Factory',
	USER_REQUEST = 'X-User-Request',
	OTP = 'X-Otp'
}

export enum Languages {
	VIETNAMESE = 'vi',
	ENGLISH = 'en',
	CHINESE = 'cn'
}

export enum PresetBreakPoints {
	SMALL = '(min-width: 360px) and (max-width: 599px)',
	MEDIUM = '(min-width: 600px) and (max-width: 1023px)',
	LARGE = '(min-width: 1024px) and (max-width: 1365px)',
	EXTRA_LARGE = '(min-width: 1366px)',
	ULTIMATE_LARGE = '(min-width: 1920px)'
}

export enum CommonActions {
	CREATE = 'CREATE',
	READ = 'READ',
	DELETE_MANY = 'DELETE_MANY',
	UPDATE_MANY = 'UPDATE_MANY',
	UPDATE = 'UPDATE',
	CANCEL = 'CANCEL',
	SAVE = 'SAVE',
	DELETE = 'DELETE',
	SET_STATUS = 'SET_STATUS',
	IMPORT = 'IMPORT',
	EXPORT = 'EXPORT'
}

export enum CofactoryRef {
	VA1 = 'A',
	VB1 = 'B',
	VB2 = 'C',
	CA1 = 'K'
}

export enum OrderStatus {
	NOT_APPROVED = 'A',
	APPROVED = 'B',
	REAPPROVED = 'D',
	CANCELLED = 'E'
}

export enum FactoryCode {
	VA1 = 'VA1',
	VB1 = 'VB1',
	VB2 = 'VB2',
	CA1 = 'CA1',
	MA1 = 'MA1'
}

export enum FactoryAgencyCode {
	VA1 = 'GL1',
	VB1 = 'GL2',
	VB2 = 'GL3',
	CA1 = 'GL4',
	MA1 = 'GL5'
}

export enum RecordStatus {
	ACTIVE = 'Y',
	INACTIVE = 'N'
}
