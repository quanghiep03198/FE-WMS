import z from 'zod'
import { ReaderAntenna } from '../-constants'

export const readerSettingsFormSchema = z.object({
	readerIP: z.ipv4({ message: 'ns_validation:invalid_ipv4' }),
	readerAnt: z.enum(ReaderAntenna, { message: 'ns_validation:invalid_value' }),
	readerPower: z.number().nonnegative().min(5).max(30)
})

export type ReaderSettingsFormValues = z.infer<typeof readerSettingsFormSchema>
