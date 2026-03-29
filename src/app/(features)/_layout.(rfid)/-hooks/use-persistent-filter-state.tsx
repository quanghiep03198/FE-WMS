import { useSessionStorageState } from 'ahooks'
import { useMemo } from 'react'
import type { ScanCapability, ScannedStatus } from '../-constants'
import { RFIDDataType } from '../-constants'

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

export const usePersistentFilterState = (dataType: RFIDDataType) => {
	const persistentKey =
		dataType === RFIDDataType.INBOUND ? 'archivedInboundEpcSearchTerms' : 'archivedOutboundEpcSearchTerms'

	const defaultFormValues = useMemo(() => {
		const values: Partial<SearchFormValues> = {
			limit: 100,
			epc: '',
			shoes_style: '',
			color_sn: '',
			mo_no: '',
			size_numcode: '',
			...(dataType === RFIDDataType.INBOUND && { scannable: 'all' }),
			...(dataType === RFIDDataType.OUTBOUND && { scanned: 'all' })
		}

		return values
	}, [dataType])

	return useSessionStorageState<Partial<SearchFormValues>>(persistentKey, {
		listenStorageChange: true,
		defaultValue: defaultFormValues
	})
}
