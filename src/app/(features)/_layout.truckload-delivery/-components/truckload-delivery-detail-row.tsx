import RoleBaseAccessControl from '@/components/guards/role-base-access-control'
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
import type { IPurchaseOrderResult } from '@/services/order.service'
import type { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { CommonActions, UserRole } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import generateAvatar from '@common/utils/generate-avatar'
import { useDateLocale } from '@hooks/use-date-locale'
import { format } from 'date-fns'
import { isNil, pick } from 'lodash-es'
import React, { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../-contexts/page-context'
import { GhostButton } from '../../../../components/shared/ghost-button'
import OutboundQtyInputFieldControl from './outbound-qty-field-control'
import PurchaseOrderFieldControl from './purchase-order-field-control'

type TruckloadDeliveryDetailRowProps = {
	index: number
	readOnly: boolean
	deletable: boolean
	isLargeScreen: boolean
	defaultValues: ITruckloadDelivery['delivery_details'][number]
	onRemove: (index?: number | number[]) => void
}

const TruckloadDeliveryDetailRow: React.FC<TruckloadDeliveryDetailRowProps> = ({
	index,
	readOnly,
	defaultValues,
	deletable,
	isLargeScreen,
	onRemove
}) => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const [snapshotData, setSnapshotData] = useState<ITruckloadDelivery['delivery_details'][number] | null>(
		defaultValues
	)
	const dateLocale = useDateLocale()

	const handleSelectPurchaseOrder = useCallback((selectedItem: IPurchaseOrderResult) => {
		setSnapshotData((prev) => {
			return {
				...prev,
				...pick(selectedItem, ['po', 'brand_name', 'factory_shoes_style', 'color_sn'])
			}
		})
	}, [])

	return (
		<TableRow aria-readonly={readOnly} className={cn('transition-allow-discrete')}>
			<TableCell align='left' className='w-[30%] xl:w-[15%]'>
				<PurchaseOrderFieldControl
					{...(readOnly && { 'aria-haspopup': 'false' })}
					name={`outbound_purchase_orders.${index}.po`}
					className='h-8 rounded-sm border-transparent py-1.5 shadow-none read-only:cursor-auto focus:border-primary read-only:focus:border-transparent'
					tabIndex={index}
					autoFocus={true}
					data-index={index}
					readOnly={readOnly}
					data-icon={false}
					data-action={CommonActions.UPDATE}
					onValueChange={(selectedItem: IPurchaseOrderResult) => handleSelectPurchaseOrder(selectedItem)}
				/>
				{/* {readOnly ? (
					<span>{snapshotData?.po}</span>
				) : (
					<PurchaseOrderFieldControl
						name={`outbound_purchase_orders.${index}.po`}
						className='h-8 rounded-sm border-transparent py-1.5 shadow-none focus:border-primary'
						tabIndex={index}
						autoFocus={true}
						data-index={index}
						readOnly={readOnly}
						data-icon={false}
						data-action={CommonActions.UPDATE}
						onValueChange={(selectedItem: IPurchaseOrderResult) => handleSelectPurchaseOrder(selectedItem)}
					/>
				)} */}
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
						<Typography variant='small' color='muted'>
							{t('ns_common:titles.unknown')}
						</Typography>
					)}
				</TableCell>
			) : (
				<Fragment>
					<TableCell align='left' className='xl:w-[15%]'>
						<span>
							{snapshotData?.brand_name ?? (
								<Typography variant='small' color='muted'>
									{t('ns_common:titles.unknown')}
								</Typography>
							)}
						</span>
					</TableCell>
					<TableCell align='left' className='xl:w-[15%]'>
						<span>
							{snapshotData?.factory_shoes_style ?? (
								<Typography variant='small' color='muted'>
									{t('ns_common:titles.unknown')}
								</Typography>
							)}
						</span>
					</TableCell>
					<TableCell align='left' className='xl:w-[15%]'>
						<span>
							{snapshotData?.color_sn ?? (
								<Typography variant='small' color='muted'>
									{t('ns_common:titles.unknown')}
								</Typography>
							)}
						</span>
					</TableCell>
				</Fragment>
			)}
			<TableCell align='left' className='w-[30%] xl:w-[15%]'>
				<OutboundQtyInputFieldControl
					aria-readonly={readOnly}
					readOnly={readOnly}
					name={`outbound_purchase_orders.${index}.outbound_qty`}
					className='h-8 rounded-sm border-transparent py-1.5 shadow-none read-only:cursor-auto focus:border-primary aria-readonly:focus:border-transparent'
					autoFocus={false}
					autoComplete='off'
					tabIndex={index + 1}
					data-action={CommonActions.CREATE}
					data-index={index}
				/>
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
									<Icon name='CalendarClock' stroke='var(--muted-foreground)' />
								)}
							</Typography>
						</Div>
					</TableCell>
				</Fragment>
			)}
			<TableCell align='right' className='w-[10%]'>
				<Tooltip message={t('ns_common:actions.delete')}>
					<RoleBaseAccessControl
						mode='mask'
						authorizedRoles={[UserRole.MANAGER, UserRole.FG_WAREHOUSE_STAFF, UserRole.IE_STAFF]}>
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
					</RoleBaseAccessControl>
				</Tooltip>
			</TableCell>
		</TableRow>
	)
}

TruckloadDeliveryDetailRow.displayName = 'TruckloadDeliveryDetailRow'

export default React.memo(
	TruckloadDeliveryDetailRow,
	(prev, next) =>
		prev.index === next.index &&
		prev.readOnly === next.readOnly &&
		prev.deletable === next.deletable &&
		prev.isLargeScreen === next.isLargeScreen &&
		prev.defaultValues?.id === next.defaultValues?.id &&
		prev.onRemove === next.onRemove
)
