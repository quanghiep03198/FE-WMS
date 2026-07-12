import type { FactoryCode, UserRole } from '@/common/constants/enums'
import type { IBaseEntity } from '@/common/types/entities'

export interface IUser extends IBaseEntity {
	username: string
	display_name: string
	password: string
	employee_code: string
	picture: string
	authorized_factory_codes: Array<FactoryCode>
	roles: Array<UserRole>
	current_factory_code: FactoryCode
	is_system_user: boolean
}
