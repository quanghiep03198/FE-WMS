export interface ITenancy {
	id: Tenant
	default?: boolean
	factory: Array<string> | string
	alias: string
	host: string
}
