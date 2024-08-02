import { Languages, Theme } from '@/common/constants/enums'
import { z } from 'zod'

export const appearanceFormSchema = z.object({
	language: z.nativeEnum(Languages),
	theme: z.nativeEnum(Theme),
	font: z.enum(['inter', 'roboto', 'system'], {
		invalid_type_error: 'Select a font',
		required_error: 'Please select a font.'
	})
})

export type AppearanceFormValues = z.infer<typeof appearanceFormSchema>
