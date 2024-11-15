import React from 'react'

import useQueryParams from '@/common/hooks/use-query-params'
import { Icon, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { usePrevious } from 'ahooks'
import { FALLBACK_ORDER_VALUE, useGetEpcQuery } from '../../_apis/rfid.api'
import { DEFAULT_PROPS, usePageContext } from '../../_contexts/-page-context'

const OrderFilterSelect: React.FC = () => {
	const { searchParams } = useQueryParams()
	const { isLoading } = useGetEpcQuery(searchParams?.process)
	const { selectedOrder, scannedOrders, setCurrentPage, setSelectedOrder } = usePageContext(
		'selectedOrder',
		'scannedOrders',
		'setCurrentPage',
		'setSelectedOrder'
	)
	const previousSelectedOrder = usePrevious(selectedOrder)

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
