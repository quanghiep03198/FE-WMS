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

export enum TransferOrderApprovalStatus {
	INAPPROVED = 'A',
	APPROVED = 'B',
	REAPPROVE = 'C',
	CANCELLED = 'D'
}
