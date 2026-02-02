import { useAuthStore } from '@/stores/auth.store'
import { object, string, type infer as Infer } from 'zod'

const user = useAuthStore.getState()?.user

console.log(user)

export const updatePasswordFormValues = object({
	currentPassword: string({ error: 'ns_validation:required' }),
	password: string({ error: 'ns_validation:required' }).min(6, {
		error: JSON.stringify({ key: 'ns_validation:min_length', bindings: { min: 6 } })
	})
})

export type UpdatePasswordFormValues = Infer<typeof updatePasswordFormValues>
