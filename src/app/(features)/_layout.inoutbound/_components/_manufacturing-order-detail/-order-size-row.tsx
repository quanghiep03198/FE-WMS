import { Badge, Button, Div, Icon, TableCell, TableRow, Tooltip } from '@/components/ui'
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
			<TableCell className='group/cell sticky left-0 z-10 font-medium drop-shadow-[1px_0px_hsl(var(--border))]'>
				<Div className='inline-flex items-center gap-x-4'>
					{data?.mo_no ?? FALLBACK_ORDER_VALUE}
					<ExchangeOrderDialogTrigger defaultValues={pick(data, 'mo_no')} />
				</Div>
			</TableCell>
			<TableCell className='!p-0'>
				<Div className='flex flex-grow border-collapse flex-nowrap divide-x'>
					{filteredSizeByOrder?.map((size) => (
						<Div
							key={size?.size_numcode}
							className='group/cell inline-grid min-w-48 shrink-0 basis-48 grid-rows-2 divide-y last:flex-1'>
							<TableCell className='font-medium'>
								<Div className='flex items-center gap-x-2'>
									{size?.size_numcode}
									<Badge variant='outline'>{size?.mat_code}</Badge>
									<ExchangeEpcDialogTrigger defaultValues={size} />
								</Div>
							</TableCell>
							<TableCell>{size?.count ?? 0}</TableCell>
						</Div>
					))}
				</Div>
			</TableCell>
			<TableCell align='right' className='sticky right-20 font-medium'>
				{data?.count}
			</TableCell>
			<TableCell align='center' className='sticky right-0 w-20'>
				<Tooltip
					triggerProps={{ asChild: true }}
					contentProps={{ side: 'left' }}
					message={t('ns_common:actions.delete')}>
					<Button
						disabled={data?.mo_no === FALLBACK_ORDER_VALUE}
						type='button'
						variant='ghost'
						size='icon'
						onClick={() => onBeforeDelete(data?.mo_no)}>
						<Icon name='Trash2' className='stroke-destructive' />
					</Button>
				</Tooltip>
			</TableCell>
		</TableRow>
	)
}

const ExchangeOrderDialogTrigger: React.FC<{ defaultValues: Pick<OrderItem, 'mo_no'> }> = ({ defaultValues }) => {
	const {
		exchangeOrderDialogOpen: open,
		setExchangeOrderDialogOpen: setOpen,
		setDefaultExchangeOrderFormValues: setDefaultValues
	} = useOrderDetailContext((state) =>
		pick(state, ['exchangeOrderDialogOpen', 'setExchangeOrderDialogOpen', 'setDefaultExchangeOrderFormValues'])
	)
	return (
		<button
			onClick={() => {
				setOpen(!open)
				setDefaultValues(defaultValues)
			}}>
			<Icon name='ArrowLeftRight' className='stroke-active opacity-0 duration-100 group-hover/cell:opacity-100' />
		</button>
	)
}

const ExchangeEpcDialogTrigger: React.FC<{ defaultValues: OrderSize }> = ({ defaultValues }) => {
	const {
		exchangeEpcDialogOpen: open,
		setExchangeEpcDialogOpen: setOpen,
		setDefaultExchangeEpcFormValues: setDefaultValues
	} = useOrderDetailContext((state) =>
		pick(state, ['exchangeEpcDialogOpen', 'setExchangeEpcDialogOpen', 'setDefaultExchangeEpcFormValues'])
	)
	return (
		<button
			onClick={() => {
				setOpen(!open)
				setDefaultValues(defaultValues)
			}}>
			<Icon name='ArrowLeftRight' className='stroke-active opacity-0 duration-100 group-hover/cell:opacity-100' />
		</button>
	)
}

export default OrderDetailTableRow
