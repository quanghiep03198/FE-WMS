import type { IBaseEntity } from '../../../common/types/entities'

export interface IDepartment extends IBaseEntity, Pick<ICompany, 'company_code'> {
	dept_code: string
	dept_name: string
}
export interface ICompany extends IBaseEntity {
	company_code: string
	company_name: string
	factory_code: string
}
