import type { Languages } from '@common/constants/enums'
import type { IBaseEntity } from '../../../common/types/entities'

export interface IDepartment extends IBaseEntity, Pick<ICompany, 'company_code'> {
	code: string
	name: { [K in Languages]: string }
}
export interface ICompany extends IBaseEntity {
	company_code: string
	company_name: string
	factory_code: string
}
