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
	USER_COMPANY = 'X-User-Company',
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
