import type { IBaseEntity } from '@common/types/entities'

export interface IWarehouse extends IBaseEntity {
	name: string
	capacity: number
	total_storage_location: number
	created_by: Partial<IUser>
	updated_by: Nullish<Partial<IUser>>
	storage_locations?: IStorageLocation[]
}

export interface IStorageLocation extends IBaseEntity {
	name: string
	warehouse: IWarehouse | string
}
