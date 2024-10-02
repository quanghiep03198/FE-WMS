import { Button, Div, Icon, TableCell, TableRow, Tooltip } from '@/components/ui'
import { pick } from 'lodash'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FALLBACK_ORDER_VALUE } from '../../_apis/rfid.api'
import { useOrderDetailContext } from '../../_contexts/-exchange-form.context'
import { OrderItem, OrderSize, usePageContext } from '../../_contexts/-page-context'

const OrderDetailTableRow: React.FC<{ data: OrderItem; onBeforeDelete?: (orderCode: string) => void }> = ({
	data,
	onBeforeDelete
}) => {
	const { scannedSizes } = usePageContext((state) => pick(state, 'scannedSizes'))
	const { t } = useTranslation()

	const filteredSizeByOrder = useMemo(
		() => scannedSizes?.filter((size) => size?.mo_no === data?.mo_no),
		[scannedSizes, data]
	)

	return (
		<TableRow>
			<TableCell className='font-medium'>{data?.mo_no ?? FALLBACK_ORDER_VALUE}</TableCell>
			<TableCell className='!p-0'>
				<Div
					className='divide-x'
					style={{
						display: 'grid',
						gridTemplateColumns: `repeat(${filteredSizeByOrder?.length}, 1fr)`
					}}>
					{filteredSizeByOrder?.map((size) => (
						<Div key={size?.size_numcode} className='group/cell grid grid-rows-2 divide-y'>
							<TableCell className='bg-secondary/25 font-medium text-secondary-foreground'>
								<Div className='inline-flex items-center gap-x-4'>
									{size?.size_numcode ?? FALLBACK_ORDER_VALUE}
									<ExchangeEpcDialogTrigger defaultValues={size} />
								</Div>
							</TableCell>
							<TableCell>{size?.count}</TableCell>
						</Div>
					))}
				</Div>
			</TableCell>
			<TableCell align='right' className='font-medium'>
				{data?.count}
			</TableCell>
			<TableCell align='center'>
				<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.delete')}>
					<Button type='button' variant='ghost' size='icon' onClick={() => onBeforeDelete(data?.mo_no)}>
						<Icon name='Trash2' className='stroke-destructive' />
					</Button>
				</Tooltip>
			</TableCell>
		</TableRow>
	)
}

const ExchangeEpcDialogTrigger: React.FC<{ defaultValues: OrderSize }> = ({ defaultValues }) => {
	const { open, setOpen, setDefaultValues } = useOrderDetailContext((state) =>
		pick(state, ['open', 'setOpen', 'setDefaultValues'])
	)
	return (
		<button
			onClick={() => {
				console.log(1)
				setOpen(!open)
				setDefaultValues(defaultValues)
			}}>
			<Icon name='ArrowLeftRight' className='stroke-active opacity-0 duration-100 group-hover/cell:opacity-100' />
		</button>
	)
}

export default OrderDetailTableRow
