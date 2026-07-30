// #region In use Entities

export interface IBaseEntity {
	id: number
	updated?: Date | string
	created?: Date | string
	remark?: string | null
	user_code_created?: string
	user_code_updated?: string
	[key: string]: any
}
