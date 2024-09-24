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

export enum Languages {
	VIETNAMESE = 'vi',
	ENGLISH = 'en',
	CHINESE = 'cn'
}

export enum PresetBreakPoints {
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
	CANCEL = 'CANCEL',
	SAVE = 'SAVE',
	DELETE = 'DELETE',
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
