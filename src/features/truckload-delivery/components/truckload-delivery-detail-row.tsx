import { CommonActions, UserRole } from '@common/constants/enums'
import generateAvatar from '@common/utils/generate-avatar'
import { Div } from '@components/customs/div'
import { Tooltip } from '@components/customs/tooltip'
import { Typography } from '@components/customs/typography'
import RoleBaseAccessControl from '@components/guards/role-base-access-control'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { Icon } from '@components/ui/icon'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@components/ui/item'
import { TableCell, TableRow } from '@components/ui/table'
import useAuth from '@hooks/use-auth'
import { useDateLocale } from '@hooks/use-date-locale'
import { format } from 'date-fns'
import { isNil, pick } from 'lodash-es'
import React, { Fragment, useCallback } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { GhostButton } from '../../../components/shared/ghost-button'
import { usePageContext } from '../contexts/page-context'
import { type UpsertPurchaseOrdersFormValues } from '../schemas'
import type { ITruckloadDeliveryPacking, TruckloadDeliveryDispatchOrder } from '../types'
import OutboundQtyInputFieldControl from './outbound-qty-field-control'
import PurchaseOrderFieldControl from './purchase-order-field-control'

type TruckloadDeliveryDetailRowProps = {
	defaultValues: ITruckloadDeliveryPacking
	deletable: boolean
	dispatchOrder: TruckloadDeliveryDispatchOrder
	isLargeScreen: boolean
	index: number
	isPersisted: boolean
	readOnly: boolean
	onRemove: (index?: number | number[]) => void
}

const TruckloadDeliveryDetailRow: React.FC<TruckloadDeliveryDetailRowProps> = ({
	index,
	readOnly,
	defaultValues,
	deletable,
	dispatchOrder,
	isLargeScreen,
	isPersisted,
	onRemove
}) => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const dateLocale = useDateLocale()
	const { user } = useAuth()
	const { control, setValue } = useFormContext<UpsertPurchaseOrdersFormValues>()
	const currentRowValue = useWatch({ control, name: `outbound_purchase_orders.${index}` })

	const handleSelectPurchaseOrder = useCallback(
		(
			selectedItem:
				| Pick<
						ITruckloadDeliveryPacking,
						'po' | 'brand_name' | 'factory_shoes_style' | 'color_sn' | 'max_outbound_qty'
				  >
				| undefined
		) => {
			if (!selectedItem) return
			setValue(`outbound_purchase_orders.${index}`, {
				...currentRowValue,
				...pick(selectedItem, ['po', 'brand_name', 'factory_shoes_style', 'color_sn', 'max_outbound_qty'])
			})
		},
		[currentRowValue]
	)

	const createdBy = currentRowValue?.created_by ?? user?.username

	const isPlaceholderData =
		currentRowValue?.brand_name === t('ns_common:titles.unknown') &&
		currentRowValue?.factory_shoes_style === t('ns_common:titles.unknown') &&
		currentRowValue?.color_sn === t('ns_common:titles.unknown')

	return (
		<TableRow
			aria-invalid={isPlaceholderData}
			aria-readonly={readOnly}
			className='transition-allow-discrete aria-invalid:[&_span]:text-muted-foreground'>
			<TableCell align='left' className='w-[30%] xl:w-[15%]'>
				<PurchaseOrderFieldControl
					{...(readOnly && { 'aria-haspopup': 'false' })}
					autoFocus={true}
					className='focus:border-primary h-8 rounded-sm border-transparent py-1.5 shadow-none read-only:cursor-auto read-only:focus:border-transparent'
					data-action={CommonActions.UPDATE}
					data-icon={false}
					data-index={index}
					name={`outbound_purchase_orders.${index}.po`}
					readOnly={readOnly}
					tabIndex={index}
					onValueChange={(selectedItem) => handleSelectPurchaseOrder(selectedItem)}
				/>
			</TableCell>
			{!isLargeScreen ? (
				<TableCell align='left' className='w-[30%] xl:hidden'>
					{Object.values(pick(currentRowValue, ['brand_name', 'factory_shoes_style', 'color_sn'])).every(
						(item) => !isNil(item)
					) ? (
						<Div className='flex flex-col'>
							<span className='line-clamp-1 font-medium'>{currentRowValue?.brand_name}</span>
							<span className='line-clamp-1'>
								{currentRowValue?.factory_shoes_style}/{currentRowValue?.color_sn}
							</span>
						</Div>
					) : (
						<Typography color='muted' variant='small'>
							{t('ns_common:titles.unknown')}
						</Typography>
					)}
				</TableCell>
			) : (
				<Fragment>
					<TableCell align='left' className='xl:w-[15%]'>
						<span>
							{currentRowValue?.brand_name ?? (
								<Typography color='muted' variant='small'>
									{t('ns_common:titles.unknown')}
								</Typography>
							)}
						</span>
					</TableCell>
					<TableCell align='left' className='xl:w-[15%]'>
						<span>
							{currentRowValue?.factory_shoes_style ?? (
								<Typography color='muted' variant='small'>
									{t('ns_common:titles.unknown')}
								</Typography>
							)}
						</span>
					</TableCell>
					<TableCell align='left' className='xl:w-[15%]'>
						<span>
							{currentRowValue?.color_sn ?? (
								<Typography color='muted' variant='small'>
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
					autoComplete='off'
					autoFocus={false}
					className='focus:border-primary h-8 rounded-sm border-transparent py-1.5 shadow-none read-only:cursor-auto aria-readonly:focus:border-transparent'
					data-action={CommonActions.CREATE}
					data-index={index}
					name={`outbound_purchase_orders.${index}.outbound_qty`}
					readOnly={readOnly}
					tabIndex={index + 1}
				/>
			</TableCell>
			{isLargeScreen && (
				<Fragment>
					<TableCell align='left' className='xl:w-[15%]'>
						<Item className='p-0' size='sm'>
							<ItemMedia>
								<Avatar className='row-span-2 size-9'>
									<AvatarImage
										alt={createdBy}
										src={createdBy ? generateAvatar({ name: createdBy }) : undefined}
									/>
									<AvatarFallback>G</AvatarFallback>
								</Avatar>
							</ItemMedia>
							<ItemContent>
								<ItemTitle className='gap-0 before:content-["@"]'>{createdBy}</ItemTitle>
								<ItemDescription
									className='line-clamp-1 first-letter:uppercase'
									title={
										!isNil(currentRowValue?.created_at)
											? format(new Date(currentRowValue?.created_at), 'yyyy-MM-dd HH:mm:ss', {
													locale: dateLocale
												})
											: undefined
									}>
									{currentRowValue?.created_at
										? format(new Date(currentRowValue?.created_at), 'yyyy-MM-dd HH:mm:ss', {
												locale: dateLocale
											})
										: format(new Date(), 'yyyy-MM-dd HH:mm:ss', { locale: dateLocale })}
								</ItemDescription>
							</ItemContent>
						</Item>
					</TableCell>
				</Fragment>
			)}
			<TableCell align='right' className='w-[10%]'>
				<Tooltip message={t('ns_common:actions.delete')}>
					<RoleBaseAccessControl
						authorizedRoles={[UserRole.MANAGER, UserRole.FG_WAREHOUSE_STAFF, UserRole.IE_STAFF]}
						mode='mask'>
						<GhostButton
							aria-haspopup={isPersisted}
							className='text-muted-foreground aria-haspopup:text-destructive'
							disabled={!deletable}
							type='button'
							onClick={() => {
								if (isPersisted) {
									event$.emit({
										action: CommonActions.DELETE,
										payload: { dispatch_order: dispatchOrder, po: defaultValues.po, index: index }
									})
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

export default TruckloadDeliveryDetailRow
