import { CommonActions } from '@/common/constants/enums'
import { z } from 'zod'

export const inoutboundSchema = z.object({
	action: z.enum([CommonActions.IMPORT, CommonActions.EXPORT], { required_error: '' })
})
