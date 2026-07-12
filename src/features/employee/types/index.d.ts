import { type IBaseEntity } from '@common/types/entities'

export interface IEmployee extends IBaseEntity {
	id: number
	employee_name: string
	employee_code: string
}
