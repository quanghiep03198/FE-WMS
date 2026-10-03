// #region In use Entities

export interface IBaseEntity {
	id: number | string
	_id: string
	updated?: Date | string
	created?: Date | string
	created_at?: Date | string
	updated_at?: Date | string
	remark?: string | null
	user_code_created?: string
	user_code_updated?: string
	[key: string]: any
}
