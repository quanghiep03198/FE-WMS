import type { ScanCapability, ScannedStatus } from '@/features/finished-goods/constants/enums'
import { StockFlow } from '@/features/finished-goods/constants/enums'
import { useSessionStorageState } from 'ahooks'
import { useMemo } from 'react'

export type SearchFormValues = {
	limit?: number
	epc: string
	shoes_style: string
	color_sn: string
	mo_no: string
	size_numcode: string
	scannable?: ScanCapability | 'all'
	scanned?: ScannedStatus | 'all'
}

export const usePersistentFilterState = (dataType: StockFlow) => {
	const persistentKey =
		dataType === StockFlow.INBOUND ? 'archivedInboundEpcSearchTerms' : 'archivedOutboundEpcSearchTerms'

	const defaultFormValues = useMemo(() => {
		const values: Partial<SearchFormValues> = {
			limit: 100,
			epc: '',
			shoes_style: '',
			color_sn: '',
			mo_no: '',
			size_numcode: '',
			...(dataType === StockFlow.INBOUND && { scannable: 'all' }),
			...(dataType === StockFlow.OUTBOUND && { scanned: 'all' })
		}

		return values
	}, [dataType])

	return useSessionStorageState<Partial<SearchFormValues>>(persistentKey, {
		listenStorageChange: true,
		defaultValue: defaultFormValues
	})
}
