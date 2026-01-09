import { enum as enums, ipv4, number, object, string, type infer as Infer } from 'zod'
import { ReaderAntenna } from '../-constants'

export const readerSettingsFormSchema = object({
	readerIP: ipv4({ error: 'ns_validation:invalid_ipv4' }),
	readerAnt: enums(ReaderAntenna, { error: 'ns_validation:invalid_value' }),
	readerPower: number({ error: 'ns_validation:req' })
		.nonnegative()
		.min(5)
		.max(30)
		.or(
			string()
				.refine((value) => !isNaN(+value) && Number.parseInt(value) >= 5 && Number.parseInt(value) <= 30, {
					error: 'ns_validation:invalid_value'
				})
				.transform((value) => Number.parseInt(value))
		)
})

export type ReaderSettingsFormValues = Infer<typeof readerSettingsFormSchema>
