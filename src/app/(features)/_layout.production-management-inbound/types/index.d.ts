import { OrderSize } from '@/app/_shared/_types/rfid'
import { IElectronicProductCode } from '@/common/types/entities'

export type PMEventStreamData = {
	epcs: Pagination<Pick<IElectronicProductCode, 'epc' | 'mo_no'>>
	orders: Record<string, Array<OrderSize>>
}

export type FetchEpcParams = {
	page: number
	selected_order: string
} & PMInboundSearch
