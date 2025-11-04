import { z } from 'zod'

export const permissionValidator = z.object({
	keyid: z.number().optional(),
	permission_name: z.string('Permission name is required').min(1, 'Permission name cannot be empty'),
	role: z.string('Role is required').min(1, 'Role cannot be empty'),
	parent_id: z.string().optional(),
	is_active: z.enum(['Y', 'N']).default('Y'),
	remark: z.string().optional()
})
export const updatePermissionValidator = permissionValidator.partial()

export type PermissionValueDTO = z.infer<typeof permissionValidator>
export type UpdatePermissionDTO = z.infer<typeof updatePermissionValidator>
