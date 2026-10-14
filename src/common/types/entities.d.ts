// #region In use Entities

export interface IBaseEntity {
	// MongoDB based fields
	_id?: string
	created_at?: Date | string
	updated_at?: Date | string
	// MSSQL based fields
	id?: number | string
	created?: Date | string
	updated?: Date | string
	user_code_created?: string
	user_code_updated?: string
	remark?: string | null

	[key: string]: any
}
