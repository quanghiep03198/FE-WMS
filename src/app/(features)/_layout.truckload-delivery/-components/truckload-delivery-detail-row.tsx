import { CommonActions } from '@/common/constants/enums'
import { useDateLocale } from '@/common/hooks/use-date-locale'
import { cn } from '@/common/utils/cn'
import { Icon, TableCell, TableRow, Tooltip } from '@/components/ui'
import { IPurchaseOrderResult } from '@/services/order.service'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { useIsMutating, useQueryClient } from '@tanstack/react-query'
import { formatRelative } from 'date-fns'
import { isNil, pick } from 'lodash'
import React, { memo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../-contexts/page-context'
import { TruckloadDeliveryQueryKeys } from '../-hooks/use-truckload-delivery-asm'
import { type UpsertPurchaseOrdersFormValues } from '../-schemas'
import { GhostButton } from '../../-components/-shared/ghost-button'
import OutboundQtyInputFieldControl from './outbound-qty-field-control'
import PurchaseOrderFieldControl from './purchase-order-field-control'

type TruckloadDeliveryDetailRowProps = {
	index: number
	parentId: string
	readonly: boolean
	isPending: boolean
	defaultValues: ITruckloadDelivery['delivery_details'][number]
	onRemove: (index?: number | number[]) => void
}

const TruckloadDeliveryDetailRow: React.FC<TruckloadDeliveryDetailRowProps> = ({
	index,
	readonly,
	isPending,
	parentId,
	defaultValues,
	onRemove
}) => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const { watch } = useFormContext<UpsertPurchaseOrdersFormValues>()
	const [snapshotData, setSnapshotData] = useState<ITruckloadDelivery['delivery_details'][number] | null>(
		defaultValues
	)
	const queryClient = useQueryClient()
	const currentId = watch(`outbound_purchase_orders.${index}.id`)
	const dateLocale = useDateLocale()
	const isDeleting =
		useIsMutating({ mutationKey: [TruckloadDeliveryQueryKeys.DELETE_PURCHASE_ORDER], exact: false }) > 0

	const handleSelectPurchaseOrder = (selectedItem: IPurchaseOrderResult) => {
		setSnapshotData((prev) => {
			console.log('prev :>> ', prev)
			return {
				...prev,
				...pick(selectedItem, ['po', 'brand_name', 'factory_shoes_style', 'color_sn'])
			}
		})

		queryClient.setQueryData(
			[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY],
			(queryData: ResponseBody<ITruckloadDelivery[]>) => {
				if (!Array.isArray(queryData?.metadata)) return queryData

				// Clone to avoid direct mutation
				const updatedMetadata = [...queryData.metadata]
				const currentDispatchOrderIndex = updatedMetadata.findIndex((item) => item.dispatch_order === parentId)

				if (currentDispatchOrderIndex === -1) return queryData

				// Clone current dispatch order
				const currentDispatchOrder = { ...updatedMetadata[currentDispatchOrderIndex] }
				const updatedDeliveryDetails = [...currentDispatchOrder.delivery_details]

				let currentPurchaseOrderIndex: number = updatedDeliveryDetails.findIndex(
					(item) => item.po === selectedItem.po && String(item.id) === String(currentId)
				)
				currentPurchaseOrderIndex = currentPurchaseOrderIndex === -1 ? index : currentPurchaseOrderIndex

				// Update delivery detail
				updatedDeliveryDetails[currentPurchaseOrderIndex] = {
					...snapshotData,
					...pick(selectedItem, ['po', 'brand_name', 'factory_shoes_style', 'color_sn'])
				}

				// Update arrays
				currentDispatchOrder.delivery_details = updatedDeliveryDetails
				updatedMetadata[currentDispatchOrderIndex] = currentDispatchOrder

				return {
					...queryData,
					metadata: updatedMetadata
				}
			}
		)

		// Invalidate query to trigger re-render
		queryClient.invalidateQueries({
			queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY],
			refetchType: 'none' // Do not refetch, chỉ notify subscribers
		})
	}

	return (
		<TableRow
			aria-readonly={readonly}
			className={cn(isDeleting && 'animate-pulse', typeof currentId === 'string' && '[&_td]:opacity-80')}>
			<TableCell align='left' className='w-[30%] xl:w-44'>
				{readonly ? (
					<span>{snapshotData?.po}</span>
				) : (
					<PurchaseOrderFieldControl
						name={`outbound_purchase_orders.${index}.po`}
						className='h-8 rounded-sm border-transparent py-1.5 shadow-none focus:border-primary'
						tabIndex={index}
						autoFocus={true}
						data-index={index}
						data-icon={false}
						data-action={CommonActions.UPDATE}
						onSelect={(selectedItem: IPurchaseOrderResult) => handleSelectPurchaseOrder(selectedItem)}
					/>
				)}
			</TableCell>
			<TableCell className='w-[30%] xl:hidden'>
				{Object.values(pick(snapshotData, ['brand_name', 'factory_shoes_style', 'color_sn'])).every(
					(item) => !isNil(item)
				) ? (
					<ul>
						<li className='font-medium'>
							<span className='line-clamp-1'>{snapshotData?.brand_name}</span>
						</li>
						<li>
							<span className='line-clamp-1'>
								{snapshotData?.factory_shoes_style}/{snapshotData?.color_sn}
							</span>
						</li>
					</ul>
				) : (
					<Icon name='Ellipsis' stroke='hsl(var(--muted-foreground))' />
				)}
			</TableCell>
			<TableCell align='left' className='md:hidden lg:hidden'>
				<span>{snapshotData?.brand_name ?? <Icon name='Ellipsis' stroke='hsl(var(--muted-foreground))' />}</span>
			</TableCell>
			<TableCell align='left' className='md:hidden lg:hidden'>
				<span>
					{snapshotData?.factory_shoes_style ?? <Icon name='Ellipsis' stroke='hsl(var(--muted-foreground))' />}
				</span>
			</TableCell>
			<TableCell align='left' className='md:hidden lg:hidden'>
				<span>{snapshotData?.color_sn ?? <Icon name='Ellipsis' stroke='hsl(var(--muted-foreground))' />}</span>
			</TableCell>
			<TableCell align='left' className='w-[30%] xl:w-[25%]'>
				{readonly ? (
					<span>{snapshotData?.outbound_qty}</span>
				) : (
					<OutboundQtyInputFieldControl
						name={`outbound_purchase_orders.${index}.outbound_qty`}
						className='h-8 rounded-sm border-transparent py-1.5 shadow-none focus:border-primary'
						autoFocus={false}
						autoComplete='off'
						tabIndex={index + 1}
						data-action={CommonActions.CREATE}
						data-index={index}
					/>
				)}
			</TableCell>
			<TableCell align='left' className='md:hidden lg:hidden'>
				<span className='!inline-flex items-center gap-x-2'>
					<Icon name='User' size={18} />
					{snapshotData?.user_code_created}
				</span>
			</TableCell>
			<TableCell align='left' className='md:hidden lg:hidden'>
				<span className='first-letter:uppercase'>
					{snapshotData?.created ? (
						formatRelative(new Date(snapshotData?.created), new Date(), { locale: dateLocale })
					) : (
						<Icon name='CalendarClock' stroke='hsl(var(--muted-foreground))' />
					)}
				</span>
			</TableCell>
			<TableCell align='right' className='w-[10%] xl:w-14'>
				<Tooltip message={t('ns_common:actions.delete')}>
					<GhostButton
						type='button'
						className={typeof snapshotData?.id !== 'number' ? 'text-destructive' : 'text-muted-foreground'}
						onClick={() => {
							if (typeof snapshotData?.id === 'number') {
								event$.emit({ action: CommonActions.DELETE, payload: snapshotData.id })
								return
							}
							onRemove(index)
						}}>
						<Icon name='X' />
					</GhostButton>
				</Tooltip>
			</TableCell>
		</TableRow>
	)
}

TruckloadDeliveryDetailRow.displayName = 'TruckloadDeliveryDetailRow'

export default memo(TruckloadDeliveryDetailRow)
