import { array, boolean, object, string, type infer as Infer } from 'zod'

/**
 * A valid EPC is a 24-character string.
 */
const VALID_EPC_LENGTH = 24

export const deleteScannedEpcsSchema = object({
	epcs: array(
		string().refine((value) => value.length === VALID_EPC_LENGTH, { message: 'ns_validation:invalid_value' })
	).nonempty({ message: 'ns_validation:required' }),

	rescannable: boolean().optional().default(false)
})

export type DeleteScannedEpcsFormValues = Infer<typeof deleteScannedEpcsSchema>
