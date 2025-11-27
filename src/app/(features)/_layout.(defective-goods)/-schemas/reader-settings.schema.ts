import { enum as enums, ipv4, number, object, type infer as Infer } from 'zod'
import { ReaderAntenna } from '../-constants'

export const readerSettingsFormSchema = object({
	readerIP: ipv4({ message: 'ns_validation:invalid_ipv4' }),
	readerAnt: enums(ReaderAntenna, { message: 'ns_validation:invalid_value' }),
	readerPower: number().nonnegative().min(5).max(30)
})

export type ReaderSettingsFormValues = Infer<typeof readerSettingsFormSchema>
