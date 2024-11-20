import React from 'react'

import { RetriableError } from '@/common/errors'
import useQueryParams from '@/common/hooks/use-query-params'
import { Icon, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { useAsyncEffect, usePrevious } from 'ahooks'
import { omit, uniqBy } from 'lodash'
import { FALLBACK_ORDER_VALUE, useGetEpcQuery } from '../../_apis/rfid.api'
import { DEFAULT_PROPS, usePageContext } from '../../_contexts/-page-context'
import { PMInboundURLSearch } from '../../_schemas/pm-inbound.schema'

const OrderFilterSelect: React.FC = () => {
	const { searchParams } = useQueryParams<PMInboundURLSearch>()
	const { isLoading } = useGetEpcQuery()
	const {
		scannedEpc,
		scannedOrders,
		scanningStatus,
		connection,
		selectedOrder,
		setScannedEpc,
		setCurrentPage,
		setSelectedOrder
	} = usePageContext(
		'scannedEpc',
		'scannedOrders',
		'scanningStatus',
		'connection',
		'selectedOrder',
		'setScannedEpc',
		'setCurrentPage',
		'setSelectedOrder'
	)
	const previousSelectedOrder = usePrevious(selectedOrder)

	// * Fetch EPC query
	const { refetch: manualFetchEpc } = useGetEpcQuery()

	// * On selected order changes and manual fetch epc query is not running
	useAsyncEffect(async () => {
		if (!connection || !scanningStatus) return
		try {
			const { data: metadata } = await manualFetchEpc()
			const previousFilteredEpc = scannedEpc?.data.filter((e) => e.mo_no === selectedOrder)
			const nextFilteredEpc = metadata?.epcs?.data ?? []
			setScannedEpc({
				...omit(metadata?.epcs, 'data'),
				data: uniqBy([...previousFilteredEpc, ...nextFilteredEpc], 'epc')
			})
		} catch {
			throw new RetriableError()
		}
	}, [selectedOrder])

	const handleChangeOrder = (value: string) => {
		setSelectedOrder(value)
		setCurrentPage(null)
	}

	return (
		<Select defaultValue={DEFAULT_PROPS.selectedOrder} value={selectedOrder} onValueChange={handleChangeOrder}>
			<SelectTrigger className='inline-flex w-full items-center gap-x-2 bg-background'>
				{selectedOrder !== previousSelectedOrder && isLoading ? (
					<Icon name='LoaderCircle' className='animate-[spin_1.75s_linear_infinite]' />
				) : (
					<Icon name='ListFilter' />
				)}
				<SelectValue placeholder={!selectedOrder && 'Select'} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={DEFAULT_PROPS.selectedOrder}>All</SelectItem>
				{Array.isArray(scannedOrders) &&
					scannedOrders?.map((item) => {
						const count = item?.sizes.reduce((acc, curr) => acc + curr.count, 0)
						return (
							<SelectItem key={item?.mo_no} value={item?.mo_no} className='flex items-center gap-x-2'>
								{item?.mo_no === 'null' ? FALLBACK_ORDER_VALUE : item?.mo_no} {`(${count} pairs)`}
							</SelectItem>
						)
					})}
			</SelectContent>
		</Select>
	)
}

export default OrderFilterSelect
