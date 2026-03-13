import { FactoryCode, UserRole } from '@/common/constants/enums'
import { array, email, enum as enums, infer as Infer, object, string } from 'zod'

export const createUserSchema = object({
	username: string({ error: 'ns_validation:required' })
		.nonempty({ error: 'ns_validation:required' })
		.min(4, { error: JSON.stringify({ key: 'ns_validation:min_length', bindings: { min: 3 } }) }),
	password: string().nullish(),
	display_name: string().nonempty({ error: 'ns_validation:required' }),
	email: email().nullish(),
	employee_code: string().nullish(),
	roles: array(enums(UserRole), { error: 'ns_validation:required' }).nonempty({ error: 'ns_validation:required' }),
	authorized_factory_codes: array(enums(FactoryCode), { error: 'ns_validation:required' }).nonempty({
		error: 'ns_validation:required'
	})
})

export const updateUserSchema = createUserSchema.partial().required({ username: true }).omit({ password: true })

export type CreateUserFormValues = Infer<typeof createUserSchema>
export type UpdateUserFormValues = Infer<typeof updateUserSchema>
