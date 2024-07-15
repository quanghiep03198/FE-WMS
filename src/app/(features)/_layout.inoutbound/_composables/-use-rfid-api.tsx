import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { TScanningStatus } from '../_context/-page-context'

export const RFID_EPC_PROVIDE_TAG = 'RFID_EPC' as const
export const DATABASE_COMPATIBILITY_PROVIDE_TAG = 'DATABASE_COMPATIBILITY' as const

export const useGetUnscannedEpc = (params: { connection: string; scanningStatus: TScanningStatus }) => {
	return useQuery({
		queryKey: [RFID_EPC_PROVIDE_TAG],
		queryFn: () => RFIDService.getUnscannedEpc(params.connection),
		enabled: params.scanningStatus === 'scanning',
		refetchInterval: 5000, // refetch every 5 seconds
		select: (response) => response.metadata
	})
}

export const useStoreEpcMutation = ({
	onSuccess
}: {
	onSuccess: React.Dispatch<React.SetStateAction<TScanningStatus>>
}) => {
	const queryClient = useQueryClient()
	const { t } = useTranslation()

	return useMutation({
		mutationKey: [RFID_EPC_PROVIDE_TAG],
		mutationFn: RFIDService.updateStockMovement,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			onSuccess(undefined)
			queryClient.invalidateQueries({ queryKey: [RFID_EPC_PROVIDE_TAG] })
			return toast.success(t('ns_common:notification.success'), { id: context })
		},
		onError: (_data, _variables, context) => toast.success(t('ns_common:notification.error'), { id: context })
	})
}

export const useSyncEpcOrderCodeMutation = () => {
	return useMutation({
		mutationKey: [RFID_EPC_PROVIDE_TAG],
		mutationFn: RFIDService.syncEpcOrderCode
	})
}

export const useGetDatabaseConnnection = () => {
	return useQuery({
		queryKey: [DATABASE_COMPATIBILITY_PROVIDE_TAG],
		queryFn: RFIDService.getDatabaseCompatibility,
		select: (response) => response.metadata
	})
}
