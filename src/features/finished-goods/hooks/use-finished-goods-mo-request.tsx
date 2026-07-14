import useAuth from '@/hooks/use-auth'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DEFAULT_PROPS, usePageContext } from '../contexts/finished-goods-inbound/page-context'
import type { ExchangeEpcPayload, ExchangeOrderFormValue } from '../schemas/exchange-epc.schema'
import { FinishedGoodsMoService } from '../services/finished-goods-mo.service'
import type { SearchCustOrderParams } from '../types'
import { FinishedGoodsInboundQueryKeys } from './use-inbound-request'

export const useSearchExchangableOrderQuery = (params: SearchCustOrderParams) => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['EXCHANGABLE_ORDER', user?.current_factory_code, params],
		queryFn: () => FinishedGoodsMoService.searchExchangableMo(params),
		enabled: false,
		select: (response) => response.metadata
	})
}

export const useExchangeEpcMutation = () => {
	const { selectedDevice, setSelectedOrder, setCurrentPage } = usePageContext(
		'selectedDevice',
		'setSelectedOrder',
		'setCurrentPage'
	)

	return useMutation({
		meta: {
			invalidates: [
				[FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_MO, FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_EPCS]
			]
		},
		mutationFn: async (payload: ExchangeOrderFormValue) =>
			await FinishedGoodsMoService.exchangeManufacturingOrder(selectedDevice, payload),
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
		}
	})
}

export const useUpsertEpcInfoMutation = () => {
	const { selectedDevice, setSelectedOrder, setCurrentPage } = usePageContext(
		'selectedDevice',
		'setSelectedOrder',
		'setCurrentPage'
	)

	return useMutation({
		meta: {
			invalidates: [
				[FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_MO, FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_EPCS]
			]
		},
		mutationFn: async (payload: ExchangeEpcPayload) =>
			await FinishedGoodsMoService.upsertEpcInformation(selectedDevice, payload),
		onSuccess: () => {
			setCurrentPage(null)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
		}
	})
}
