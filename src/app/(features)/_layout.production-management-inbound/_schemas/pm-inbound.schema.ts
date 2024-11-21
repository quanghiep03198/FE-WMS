import { z } from 'zod'
import { ProducingProcessSuffix } from '../_constants/index.const'

export const pmInboundSearchValidator = z.object({
	process: z.nativeEnum(ProducingProcessSuffix).optional()
})

export type PMInboundURLSearch = z.infer<typeof pmInboundSearchValidator>
