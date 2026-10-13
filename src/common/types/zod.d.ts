import type { FieldValues } from 'react-hook-form'

export module 'zod' {
	type Infer<T> = T & FieldValues
}
