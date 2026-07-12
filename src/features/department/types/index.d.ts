import type { IBaseEntity, ICompany } from '../../../common/types/entities'

export interface IDepartment extends IBaseEntity, Pick<ICompany, 'company_code'> {
	dept_code: string
	dept_name: string
}
