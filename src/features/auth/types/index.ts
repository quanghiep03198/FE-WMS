import type { UserRole } from '@common/constants/enums'
import type { IBaseEntity } from '@common/types/entities'

export interface IUser extends IBaseEntity {
	username: string
	display_name: string
	password: string
	avatar: string
	roles: Array<UserRole>
	is_system_user: boolean
	deleted: boolean
	// authorized_factory_codes: Array<FactoryCode>
	// current_factory_code: FactoryCode
	// employee_code: string
}
