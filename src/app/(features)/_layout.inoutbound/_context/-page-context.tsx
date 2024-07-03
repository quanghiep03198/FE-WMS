import { IElectronicProductCode } from '@/common/types/entities'
import { RFIDService } from '@/services/rfid.service'
import { useQuery } from '@tanstack/react-query'
import { useResetState, type ResetState } from 'ahooks'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export type TScanningStatus = 'scanning' | 'stopped' | 'finished' | undefined

type TPageContext = {
	scanningStatus: TScanningStatus
	isScanningError: boolean
	data: Array<IElectronicProductCode>
	connection: string
	currentOrderCode: string | null
	setConnection: React.Dispatch<React.SetStateAction<string>>
	setScanningStatus: React.Dispatch<React.SetStateAction<TScanningStatus>>
	resetScanningStatus: ResetState
}

export const RFID_EPC_PROVIDE_TAG = 'RFID_EPC' as const

export const PageContext = createContext<TPageContext>(null)

export const PageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [scanningStatus, setScanningStatus, resetScanningStatus] = useResetState<TScanningStatus>(undefined)
	const [connection, setConnection] = useState<string>()

	const { t } = useTranslation()

	const { data: scannedEPC } = useQuery({
		queryKey: [RFID_EPC_PROVIDE_TAG],
		queryFn: RFIDService.getUnscannedEPC,
		enabled: scanningStatus === 'scanning',
		refetchInterval: 5000, // refetch every 5 seconds
		select: (response) => response.metadata
	})

	const data = useMemo(
		() => (typeof scanningStatus === 'undefined' ? [] : Array.isArray(scannedEPC) ? scannedEPC : []),
		[scanningStatus, scannedEPC]
	)

	// Get current order is being scanned
	const currentOrderCode = useMemo(() => {
		const potentialOrderCode = data.map((item) => item.mo_no)
		return potentialOrderCode.length > 0
			? Array.from(new Set(potentialOrderCode)).reduce((prev, curr) =>
					potentialOrderCode.filter((el) => el === curr).length >
					potentialOrderCode.filter((el) => el === prev).length
						? curr
						: prev
				)
			: null
	}, [data])

	const isScanningError = useMemo(() => {
		const uniqueOrderCodeList = [...new Set(data.map((item) => item.mo_no))]
		return uniqueOrderCodeList.length > 1
	}, [data, currentOrderCode])

	useEffect(() => {
		if (isScanningError) {
			setScanningStatus('stopped')
			toast.error(t('ns_common:notification.error'), {
				description: t('ns_inoutbound:notification.conflict_mono'),
				action: {
					label: 'Reset',
					onClick: () => setScanningStatus(undefined)
				},
				classNames: {
					toast: 'grid grid-cols-[0.25fr_auto] items-start bg-popover',
					actionButton: 'mt-1 flex col-span-full ml-auto items-center justify-center w-12'
				},
				duration: 5000
			})
		}
	}, [isScanningError])

	return (
		<PageContext.Provider
			value={{
				data,
				currentOrderCode,
				scanningStatus,
				isScanningError,
				connection,
				setConnection,
				setScanningStatus,
				resetScanningStatus
			}}>
			{children}
		</PageContext.Provider>
	)
}
