import { DepartmentService } from '@/services/department.service'
import { RFIDService } from '@/services/rfid.service'
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useUnmount } from 'ahooks'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ScanningStatus } from '../_contexts/-page-context'

// API Query Keys
export const RFID_EPC_PROVIDE_TAG = 'RFID_EPC'
export const INOUTBOUND_DEPT_PROVIDE_TAG = 'SHAPING_DEPARTMENT'
export const CUST_ORDER_PROVIDE_TAG = 'CUST_ORDER'

export const UNKNOWN_ORDER = 'Unknown'

type GetEPCQueryArgs = { connection: string; scanningStatus: ScanningStatus }
type UpdateOrderCodeMutationArgs = { host: string; previousOrder: string; payload: any }

export const useGetScannedEPCQuery = (params: GetEPCQueryArgs) => {
	const controllerRef = useRef(new AbortController())

	useEffect(() => {
		// Cancel current request if user stop scanning
		if (params.scanningStatus !== 'connected') controllerRef.current.abort()
		else controllerRef.current = new AbortController()
	}, [params.scanningStatus])

	useUnmount(() => {
		controllerRef.current.abort() // Cancel current request if user wish to leave the page
	})

	return useQuery({
		queryKey: [RFID_EPC_PROVIDE_TAG, params.connection],
		queryFn: async () => {
			return await RFIDService.getScannedEPC({
				signal: controllerRef.current.signal,
				headers: { ['X-Database-Host']: params.connection }
			})
		},
		enabled: params.scanningStatus === 'connected',
		refetchInterval: 5000, // refetch every 5 seconds
		select: (response) => response.metadata
	})
}

export const useUpdateEpcMutation = () => {
	return useMutation({
		mutationKey: [RFID_EPC_PROVIDE_TAG],
		mutationFn: RFIDService.updateStockMovement
	})
}

export const useGetInoutboundDeptQuery = () => {
	return useQuery({
		queryKey: [INOUTBOUND_DEPT_PROVIDE_TAG],
		queryFn: DepartmentService.getShapingDepartments,
		select: (response) => response.metadata
	})
}

export const useDeleteOrderMutation = () => {
	return useMutation({
		mutationKey: [RFID_EPC_PROVIDE_TAG],
		mutationFn: ({ host, orderCode }: { host: string; orderCode: string }) =>
			RFIDService.deleteScannedOrder(host, orderCode)
	})
}

export const useGetCustOrderListQuery = (host: string, searchTerm: string) => {
	return useSuspenseQuery({
		queryKey: [CUST_ORDER_PROVIDE_TAG, host],
		queryFn: async () => await RFIDService.getCustOrderList(host, searchTerm),
		select: (response) => {
			console.log(response.metadata)
			return Array.isArray(response.metadata) ? response.metadata : []
		}
	})
}

export const useUpdateOrderCodeMutation = (
	optimisticUpdateHandler: (variables: UpdateOrderCodeMutationArgs['payload']) => void
) => {
	const queryClient = useQueryClient()
	const { t } = useTranslation()

	return useMutation({
		mutationKey: [RFID_EPC_PROVIDE_TAG],
		mutationFn: async ({ host, previousOrder, payload }: UpdateOrderCodeMutationArgs) => {
			return await RFIDService.updateInventoryOrderCode(host, previousOrder, payload)
		},
		onMutate: () => {
			return toast.loading(t('ns_common:notification.processing_request'))
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [RFID_EPC_PROVIDE_TAG] })
			toast.success(t('ns_common:notification.success'), { id: context })
		},
		onError: (_error, _variables, context) => {
			queryClient.cancelQueries({ queryKey: [RFID_EPC_PROVIDE_TAG] })
			toast.error(t('ns_common:notification.error'), { id: context })
		},
		onSettled: (_data, _error, variables) => {
			optimisticUpdateHandler(variables.payload)
		}
	})
}
