import { array, object, string, type infer as Infer } from 'zod'

export const createStorageLocationSchema = object({
	warehouse: string().trim().nonempty({ message: 'ns_validation:required' }),
	locations: array(
		object({
			name: string().trim().nonempty({ message: 'ns_validation:required' })
		})
	)
}).check(({ issues, value }) => {
	value.locations.forEach((location, index) => {
		if (!location.name)
			issues.push({
				code: 'custom',
				message: 'ns_validation:required',
				input: `locations.${index}.name`,
				continue: true
			})
		if (value.locations.filter((loc) => loc.name === location.name).length > 1)
			issues.push({
				code: 'custom',
				message: 'ns_validation:duplicate',
				input: `locations.${index}.name`,
				continue: true
			})
	})
})

export const updateStorageLocationSchema = object({
	_id: string().trim().nonempty({ message: 'ns_validation:required' }),
	name: string().trim().nonempty({ message: 'ns_validation:required' })
})

export type CreateStorageLocationFormValue = Required<Infer<typeof createStorageLocationSchema>>
export type UpdateStorageLocationFormValue = Required<Infer<typeof updateStorageLocationSchema>>
