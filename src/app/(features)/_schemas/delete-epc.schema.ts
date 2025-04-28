import { z } from 'zod'

/**
 * A valid EPC is a 24-character string.
 */
const VALID_EPC_LENGTH = 24

export const deleteScannedEpcsSchema = z.object({
	epcs: z
		.array(
			z.string().refine((value) => value.length === VALID_EPC_LENGTH, { message: 'ns_validation:invalid_value' })
		)
		.nonempty(),

	rescannable: z.boolean().optional().default(false)
})

export type DeleteScannedEpcsFormValues = z.infer<typeof deleteScannedEpcsSchema>
