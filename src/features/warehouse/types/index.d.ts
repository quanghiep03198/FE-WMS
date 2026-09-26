import type { IBaseEntity } from '@common/types/entities'

export interface IWarehouse extends IBaseEntity {
	name: string
	capacity: number
	total_locations_storage: number
	created_by: { _id: string; username: string; display_name: string }
	updated_by: { _id: string; username: string; display_name: string } | null
	storage_locations?: IStorageLocation[]
}

export interface IStorageLocation extends IBaseEntity {
	name: string
	warehouse: IWarehouse | string
}
