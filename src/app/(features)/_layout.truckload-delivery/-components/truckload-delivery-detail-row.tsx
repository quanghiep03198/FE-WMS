import { CommonActions, PresetBreakPoints } from '@/common/constants/enums'
import { useDateLocale } from '@/common/hooks/use-date-locale'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import formatIntlNumber from '@/common/utils/format-intl-number'
import generateAvatar from '@/common/utils/generate-avatar'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Div,
	Icon,
	TableCell,
	TableRow,
	Tooltip,
	Typography
} from '@/components/ui'
import { IPurchaseOrderResult } from '@/services/order.service'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { format } from 'date-fns'
import { isNil, pick } from 'lodash-es'
import React, { Fragment, memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../-contexts/page-context'
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
	const [snapshotData, setSnapshotData] = useState<ITruckloadDelivery['delivery_details'][number] | null>(
		defaultValues
	)
	const dateLocale = useDateLocale()

	const handleSelectPurchaseOrder = (selectedItem: IPurchaseOrderResult) => {
		setSnapshotData((prev) => {
			return {
				...prev,
				...pick(selectedItem, ['po', 'brand_name', 'factory_shoes_style', 'color_sn'])
			}
		})
	}

	return (
		<TableRow aria-readonly={readonly} className={cn('transition-allow-discrete')}>
			<TableCell align='left' className='w-[30%] xl:w-[15%]'>
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
				<TableCell className='w-[30%] xl:hidden' align='left'>
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
					<TableCell align='left' className='xl:w-[15%]'>
						<span>
							{snapshotData?.brand_name ?? <Icon name='Ellipsis' stroke='hsl(var(--muted-foreground))' />}
						</span>
					</TableCell>
					<TableCell align='left' className='xl:w-[15%]'>
						<span>
							{snapshotData?.factory_shoes_style ?? (
								<Icon name='Ellipsis' stroke='hsl(var(--muted-foreground))' />
							)}
						</span>
					</TableCell>
					<TableCell align='left' className='xl:w-[15%]'>
						<span>
							{snapshotData?.color_sn ?? <Icon name='Ellipsis' stroke='hsl(var(--muted-foreground))' />}
						</span>
					</TableCell>
				</Fragment>
			)}
			<TableCell align='left' className='w-[30%] xl:w-[15%]'>
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
					<TableCell align='left' className='xl:w-[15%]'>
						<Div className='grid grid-cols-[auto_1fr] items-center gap-x-2'>
							<Avatar className='row-span-2 size-8'>
								<AvatarImage
									src={generateAvatar({ name: snapshotData?.user_code_created })}
									alt={snapshotData?.user_code_created}
								/>
								<AvatarFallback>G</AvatarFallback>
							</Avatar>
							<Typography variant='small' className='col-start-2 font-medium before:content-["@"]'>
								{snapshotData?.user_code_created}
							</Typography>
							<Typography
								variant='small'
								color='muted'
								className='col-start-2 line-clamp-1 first-letter:uppercase'
								title={
									snapshotData?.created &&
									format(new Date(snapshotData?.created), 'yyyy-MM-dd HH:mm:ss', { locale: dateLocale })
								}>
								{snapshotData?.created ? (
									format(new Date(snapshotData?.created), 'yyyy-MM-dd HH:mm:ss', { locale: dateLocale })
								) : (
									<Icon name='CalendarClock' stroke='hsl(var(--muted-foreground))' />
								)}
							</Typography>
						</Div>
					</TableCell>
				</Fragment>
			)}
			<TableCell align='right' className='w-[10%]'>
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
