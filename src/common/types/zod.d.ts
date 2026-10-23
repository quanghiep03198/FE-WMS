import type { FieldValues } from 'react-hook-form'
import { type infer as zInfer } from 'zod'
export module 'zod' {
	type Infer<T> = zInfer<T> & FieldValues
}
