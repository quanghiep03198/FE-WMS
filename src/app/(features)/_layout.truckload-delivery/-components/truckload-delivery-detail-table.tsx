'use no memo'

import { CommonActions } from '@/common/constants/enums'
import {
	Button,
	Div,
	Icon,
	Separator,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Tooltip,
	Typography
} from '@/components/ui'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { pick, uniqBy } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../-contexts/page-context'
import { useUpsertPurchaseOrdersMutation } from '../-hooks/use-truckload-delivery-asm'
import { type UpsertPurchaseOrdersFormValues, upsertPurchaseOrdersSchema } from '../-schemas'
import { GhostButton } from '../../-components/-shared/ghost-button'
import OutboundQtyInputFieldControl from './outbound-qty-field-control'
import PurchaseOrderFieldControl from './purchase-order-field-control'

const TruckloadDeliveryDetailTable: React.FC<
	Record<'data', Pick<ITruckloadDelivery, 'dispatch_order' | 'delivery_details'>>
> = ({ data }) => {
	const { t } = useTranslation()
	const [action, setAction] = useState<CommonActions.UPDATE | null>(null)
	const form = useForm<UpsertPurchaseOrdersFormValues>({
		resolver: zodResolver(upsertPurchaseOrdersSchema)
	})

	const { fields, append, remove } = useFieldArray({ control: form.control, name: 'outbound_purchase_orders' })

	const { mutateAsync, isPending, isError } = useUpsertPurchaseOrdersMutation()
	const toastRef = useRef<string | number | null>(null)

	const handleSaveChanges = async (data: UpsertPurchaseOrdersFormValues) => {
		toastRef.current = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await mutateAsync(data)
			toast.success(t('ns_common:notification.success'), { id: toastRef.current })
		} catch {
			toast.error(t('ns_common:notification.error'), { id: toastRef.current })
		}
	}

	useEffect(() => {
		form.reset({
			dispatch_order: data.dispatch_order,
			outbound_purchase_orders: uniqBy(
				data?.delivery_details?.map((item) => pick(item, ['id', 'po', 'outbound_qty'])),
				(item) => item.po
			)
		})
	}, [data])

	const handleCancelChange = () => {
		setAction(null)
		form.reset({
			dispatch_order: data.dispatch_order,
			outbound_purchase_orders: uniqBy(data.delivery_details, (item) => item.po).map((item) =>
				pick(item, ['id', 'po', 'outbound_qty'])
			)
		})
	}

	return (
		<Div className='relative rounded-md border bg-background'>
			<FormProvider {...form}>
				<Form onSubmit={form.handleSubmit(handleSaveChanges)}>
					<FieldSet>
						<Table className='w-full table-fixed border-separate border-spacing-0 [&_td:has(input)]:!p-0.5 [&_td>span]:line-clamp-1 [&_td]:h-12 [&_td]:border-x-0 [&_th>span]:line-clamp-1 [&_th]:border-x-0 [&_th]:bg-table-head'>
							<TableHeader className='sticky top-0 z-10'>
								<TableRow>
									<TableHead align='left' title={t('ns_erp:fields.po')}>
										<span>{t('ns_erp:fields.po')}</span>
									</TableHead>
									<TableHead align='left' title={t('ns_erp:fields.brand_name')}>
										<span>{t('ns_erp:fields.brand_name')}</span>
									</TableHead>
									<TableHead align='left' title={t('ns_erp:fields.shoestyle_codefactory')}>
										<span>{t('ns_erp:fields.shoestyle_codefactory')}</span>
									</TableHead>
									<TableHead align='left' title={t('ns_erp:fields.color_sn')}>
										<span>{t('ns_erp:fields.color_sn')}</span>
									</TableHead>
									<TableHead align='left' title={t('ns_erp:fields.outbound_qty')}>
										<span>{t('ns_erp:fields.outbound_qty')}</span>
									</TableHead>
									<TableHead align='right'></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{fields.map((field, index) => {
									const rowData = data?.delivery_details?.[index] ?? {
										id: null,
										po: '',
										brand_name: null,
										factory_shoes_style: null,
										color_sn: null,
										outbound_qty: 0,
										max_outbound_qty: null
									}

									return (
										<ArrayFieldItem
											key={field.id}
											index={index}
											readonly={!action}
											defaultValues={rowData}
											onRemove={remove}
										/>
									)
								})}
							</TableBody>
						</Table>
					</FieldSet>
					<Div className='m-4 grid place-content-center place-items-center gap-y-4 rounded-md border border-dashed p-4'>
						{!action ? (
							<Button variant='outline' type='button' size='sm' onClick={() => setAction(CommonActions.UPDATE)}>
								<Icon name='PenLine' /> {t('ns_common:actions.update')}
							</Button>
						) : (
							<Div className='flex items-center gap-x-1'>
								<Button
									variant='outline'
									type='button'
									size='sm'
									disabled={isPending}
									onClick={() =>
										append({
											id: null,
											po: '',
											outbound_qty: null,
											max_outbound_qty: null
										})
									}>
									<Icon name='ListPlus' /> {t('ns_common:table.add_row')}
								</Button>
								<Separator orientation='vertical' className='mx-2 h-8' />
								<Button type='submit' size='sm' disabled={isPending}>
									<Icon name={isPending ? 'LoaderCircle' : 'Check'} className={isPending && 'animate-spin'} />
									{isError ? t('ns_common:actions.retry') : t('ns_common:actions.save')}
								</Button>
								<Button
									type='button'
									size='sm'
									variant='outline'
									onClick={handleCancelChange}
									disabled={isPending}>
									<Icon name='X' />
									{t('ns_common:actions.cancel')}
								</Button>
							</Div>
						)}

						{action && (
							<Div className='col-span-full inline-flex items-center'>
								<Icon
									name='BotMessageSquare'
									size={24}
									className='mr-2 duration-500 animate-in zoom-in-0 slide-in-from-bottom-2'
								/>
								&quot;
								<Typography variant='small' className='italic'>
									Do not add duplicate purchase orders and double check the outbound quantities.
								</Typography>
								&quot;
							</Div>
						)}
					</Div>
				</Form>
			</FormProvider>
		</Div>
	)
}

type ArrayFieldItemProps = {
	index: number
	readonly: boolean
	defaultValues: ITruckloadDelivery['delivery_details'][number]
	onRemove: (index?: number | number[]) => void
}

const ArrayFieldItem: React.FC<ArrayFieldItemProps> = ({ index, readonly, defaultValues, onRemove }) => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const [data, setData] = useState<ITruckloadDelivery['delivery_details'][number] | null>(defaultValues)

	return (
		<TableRow aria-readonly={readonly}>
			<TableCell align='left'>
				{readonly ? (
					<span>{data?.po}</span>
				) : (
					<PurchaseOrderFieldControl
						name={`outbound_purchase_orders.${index}.po`}
						className='h-8 rounded-sm border-transparent py-1.5 shadow-none focus:border-primary'
						tabIndex={index}
						autoFocus={true}
						data-index={index}
						data-icon={false}
						data-action={CommonActions.UPDATE}
						onSelect={(selectedItem) => {
							setData(selectedItem)
						}}
					/>
				)}
			</TableCell>
			<TableCell align='left'>
				<span>{data?.brand_name ?? <Icon name='Ellipsis' stroke='hsl(var(--muted-foreground))' />}</span>
			</TableCell>
			<TableCell align='left'>
				<span>{data?.factory_shoes_style ?? <Icon name='Ellipsis' stroke='hsl(var(--muted-foreground))' />}</span>
			</TableCell>
			<TableCell align='left'>
				<span>{data?.color_sn ?? <Icon name='Ellipsis' stroke='hsl(var(--muted-foreground))' />}</span>
			</TableCell>
			<TableCell align='left'>
				{readonly ? (
					<span>{data?.outbound_qty}</span>
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
			<TableCell align='right'>
				<Tooltip message={t('ns_common:actions.delete')}>
					<GhostButton
						type='button'
						className={typeof data?.id === 'number' ? 'text-destructive' : 'text-muted-foreground'}
						onClick={() => {
							if (typeof data?.id === 'number') {
								event$.emit({ action: CommonActions.DELETE, payload: data.id })
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

const Form = tw.form`flex flex-col gap-y-6`
const FieldSet = tw.fieldset`h-64 overflow-scroll`

export default TruckloadDeliveryDetailTable
