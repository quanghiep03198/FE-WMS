import { OrderSize } from '@/app/_shared/_types/rfid'
import { IElectronicProductCode } from '@/common/types/entities'

export type PMEventStreamData = {
	epcs: Pagination<Pick<IElectronicProductCode, 'epc' | 'mo_no'>>
	orders: Record<string, Array<OrderSize>>
}

export type FetchPMEpcParams = {
	page: number
	'producing_process.eq': ProducingProcessSuffix
	'mo_no.eq': string
}

export type DeletePMOrderParams = {
	'producing_process.eq': ProducingProcessSuffix
	'mo_no.eq': string
}
