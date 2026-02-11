import { useAuthStore } from '@/stores/auth.store'
import { compareSync } from 'bcryptjs-react'
import { debounce } from 'lodash-es'
import { object, string, type infer as Infer } from 'zod'

const { user } = useAuthStore.getState()

export const updatePasswordFormValues = object({
	currentPassword: string({ error: 'ns_validation:required' }).refine(
		debounce((value) => compareSync(value, user?.password), 200),
		{ error: 'ns_auth:' }
	),
	password: string({ error: 'ns_validation:required' }).min(3, {
		error: JSON.stringify({ key: 'ns_validation:min_length', bindings: { min: 3 } })
	})
})

export type UpdatePasswordFormValues = Infer<typeof updatePasswordFormValues>
