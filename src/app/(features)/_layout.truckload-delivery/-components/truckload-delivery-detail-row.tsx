import { CommonActions, PresetBreakPoints } from '@/common/constants/enums'
import { useDateLocale } from '@/common/hooks/use-date-locale'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div, Icon, TableCell, TableRow, Tooltip } from '@/components/ui'
import { IPurchaseOrderResult } from '@/services/order.service'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { useIsMutating } from '@tanstack/react-query'
import { formatRelative } from 'date-fns'
import { isNil, pick } from 'lodash'
import React, { Fragment, memo, useState } from 'react'
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
	readonly: boolean
	deletable: boolean
	defaultValues: ITruckloadDelivery['delivery_details'][number]
	onRemove: (index?: number | number[]) => void
}

const TruckloadDeliveryDetailRow: React.FC<TruckloadDeliveryDetailRowProps> = ({
	index,
	readonly,
	defaultValues,
	deletable,
	onRemove
}) => {
	const isLargeScreen = useMediaQuery(PresetBreakPoints.EXTRA_LARGE)
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const { watch } = useFormContext<UpsertPurchaseOrdersFormValues>()
	const [snapshotData, setSnapshotData] = useState<ITruckloadDelivery['delivery_details'][number] | null>(
		defaultValues
	)
	const dateLocale = useDateLocale()
	const isDeleting = useIsMutating({ mutationKey: [TruckloadDeliveryQueryKeys.DELETE_PURCHASE_ORDER] })

	const currentId = watch(`outbound_purchase_orders.${index}.id`)
	const handleSelectPurchaseOrder = (selectedItem: IPurchaseOrderResult) => {
		setSnapshotData((prev) => {
			return {
				...prev,
				...pick(selectedItem, ['po', 'brand_name', 'factory_shoes_style', 'color_sn'])
			}
		})
	}

	const isCurrentRowIsDeleting = isDeleting && typeof currentId === 'number'

	const isNewRow = typeof currentId === 'string'

	return (
		<TableRow
			aria-readonly={readonly}
			className={cn(
				'transition-allow-discrete',
				isCurrentRowIsDeleting && '[&_td]:duration-1000 [&_td]:ease-out [&_td]:animate-out [&_td]:fade-out-0',
				isNewRow && 'duration-200 ease-out animate-in fade-in-0 slide-in-from-top-2 [&_td]:opacity-80'
			)}>
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
						onValueChange={(selectedItem: IPurchaseOrderResult) => handleSelectPurchaseOrder(selectedItem)}
					/>
				)}
			</TableCell>
			{!isLargeScreen ? (
				<TableCell className='w-[30%]'>
					{Object.values(pick(snapshotData, ['brand_name', 'factory_shoes_style', 'color_sn'])).every(
						(item) => !isNil(item)
					) ? (
						<Div className='flex flex-col'>
							<span className='line-clamp-1 font-medium'>{snapshotData?.brand_name}</span>
							<span className='line-clamp-1'>
								{snapshotData?.factory_shoes_style}/{snapshotData?.color_sn}
							</span>
						</Div>
					) : (
						<Icon name='Ellipsis' stroke='hsl(var(--muted-foreground))' />
					)}
				</TableCell>
			) : (
				<Fragment>
					<TableCell align='left'>
						<span>
							{snapshotData?.brand_name ?? <Icon name='Ellipsis' stroke='hsl(var(--muted-foreground))' />}
						</span>
					</TableCell>
					<TableCell align='left'>
						<span>
							{snapshotData?.factory_shoes_style ?? (
								<Icon name='Ellipsis' stroke='hsl(var(--muted-foreground))' />
							)}
						</span>
					</TableCell>
					<TableCell align='left'>
						<span>
							{snapshotData?.color_sn ?? <Icon name='Ellipsis' stroke='hsl(var(--muted-foreground))' />}
						</span>
					</TableCell>
				</Fragment>
			)}
			<TableCell align='left' className='w-[30%] xl:w-[25%]'>
				{readonly ? (
					<span>{formatIntlNumber(snapshotData?.outbound_qty)}</span>
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
			{isLargeScreen && (
				<Fragment>
					<TableCell align='left'>
						<span className='!inline-flex items-center gap-x-2'>
							<Icon name='User' size={18} />
							{snapshotData?.user_code_created}
						</span>
					</TableCell>
					<TableCell align='left'>
						<span className='first-letter:uppercase'>
							{snapshotData?.created ? (
								formatRelative(new Date(snapshotData?.created), new Date(), { locale: dateLocale })
							) : (
								<Icon name='CalendarClock' stroke='hsl(var(--muted-foreground))' />
							)}
						</span>
					</TableCell>
				</Fragment>
			)}
			<TableCell align='right' className='w-[10%] xl:w-14'>
				<Tooltip message={t('ns_common:actions.delete')}>
					<GhostButton
						type='button'
						disabled={!deletable}
						className={
							typeof snapshotData?.id === 'number'
								? 'text-destructive hover:text-destructive'
								: 'text-muted-foreground'
						}
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
