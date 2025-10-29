import { RecordStatus, Role } from '@/common/constants/enums'
import { z } from 'zod'

export const UserFormSchema = z.object({
	keyid: z.number().int().nullable(),

	isactive: z.enum(RecordStatus),

	user_code: z.string().min(1, { message: 'User code is required' }),
	employee_name: z.string().min(1, { message: 'Employee name is required' }),

	user_password: z
		.union([z.string(), z.null()])
		.refine((v) => v === null || v === '' || (typeof v === 'string' && v.length >= 6), {
			message: 'Password must be at least 6 characters'
		}),

	role: z.union([z.enum(Role), z.literal(''), z.null()]),

	email: z.union([z.email({ message: 'Invalid email format' }), z.literal(''), z.null()]),

	sex: z.union([z.enum(['M', 'F']), z.literal(''), z.null()]),

	birthday: z.preprocess((arg) => {
		if (arg === '' || arg === null || typeof arg === 'undefined') return null
		return arg
	}, z.date().nullable())
})

export type UserFormValue = z.infer<typeof UserFormSchema>
