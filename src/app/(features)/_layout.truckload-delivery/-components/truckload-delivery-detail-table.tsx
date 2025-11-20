import { CommonActions } from '@/common/constants/enums'
import { Button, Div, Icon, Separator, Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui'
import { Typewriter } from '@/components/ui/@custom/type-writter'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { isNil, pick, sortBy, uniqBy } from 'lodash'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { TruckloadDeliveryQueryKeys, useUpsertPurchaseOrdersMutation } from '../-hooks/use-truckload-delivery-asm'
import { type UpsertPurchaseOrdersFormValues, upsertPurchaseOrdersSchema } from '../-schemas'
import TruckloadDeliveryDetailRow from './truckload-delivery-detail-row'

type TruckloadDeliveryDetailTableProps = {
	data: Pick<ITruckloadDelivery, 'dispatch_order' | 'delivery_details'>
	onCollapse?: () => void
}

const TruckloadDeliveryDetailTable: React.FC<TruckloadDeliveryDetailTableProps> = ({ data, onCollapse }) => {
	const { t } = useTranslation()
	const [action, setAction] = useState<CommonActions.UPDATE | null>(null)
	const form = useForm<UpsertPurchaseOrdersFormValues>({
		resolver: zodResolver(upsertPurchaseOrdersSchema)
	})
	const { fields, append, remove } = useFieldArray({ control: form.control, name: 'outbound_purchase_orders' })

	const { mutateAsync, isPending, isError } = useUpsertPurchaseOrdersMutation()
	const toastRef = useRef<string | number | null>(null)
	const queryClient = useQueryClient()

	useEffect(() => {
		if (isPending) return
		handleResetDeliveryDetails(true, true)
	}, [data])

	const handleResetDeliveryDetails = (
		shouldKeepUpdating: boolean = true,
		shouldRestoreUpdatingData: boolean = true
	) => {
		if (isPending) return
		if (!shouldKeepUpdating) setAction(null)

		if (!shouldRestoreUpdatingData) {
			queryClient.setQueryData(
				[TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY],
				(oldData: ResponseBody<ITruckloadDelivery[]>) => {
					return {
						...oldData,
						metadata: oldData.metadata.map((item) => ({
							...item,
							delivery_details: item.delivery_details.filter((item) => !isNil(item.id))
						}))
					}
				}
			)
			queryClient.invalidateQueries({
				queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY],
				refetchType: 'none'
			})
		}

		const defaultFormValues = Array.isArray(data.delivery_details)
			? uniqBy(
					data.delivery_details
						.filter((item) => !isNil(item.id))
						.map((item) => pick(item, ['id', 'po', 'outbound_qty'])),
					(item) => item.id
				)
			: []

		const addedItems = form.getValues('outbound_purchase_orders').filter(({ id }) => isNil(id))

		form.reset({
			dispatch_order: data.dispatch_order,
			outbound_purchase_orders: sortBy(
				[...defaultFormValues, ...(shouldRestoreUpdatingData ? addedItems : [])],
				(item) => item.id
			)
		})
	}

	const handleSaveChanges = async (data: UpsertPurchaseOrdersFormValues) => {
		toastRef.current = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await mutateAsync(data)
			toast.success(t('ns_common:notification.success'), { id: toastRef.current })
			handleResetDeliveryDetails(false, false)
		} catch {
			toast.error(t('ns_common:notification.error'), { id: toastRef.current })
		}
	}

	const handleRemoveFieldItem = useCallback(remove, [])

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
										<TruckloadDeliveryDetailRow
											key={field.id}
											index={index}
											parentId={data.dispatch_order}
											readonly={!action || isPending}
											defaultValues={rowData}
											onRemove={handleRemoveFieldItem}
										/>
									)
								})}
							</TableBody>
						</Table>
					</FieldSet>
					<Div className='m-4 grid place-content-center place-items-center gap-y-4 rounded-md border border-dashed p-4'>
						<Div className='flex items-center gap-x-1'>
							{!action ? (
								<Button
									variant='default'
									type='button'
									size='sm'
									onClick={() => setAction(CommonActions.UPDATE)}>
									<Icon name='PenLine' /> {t('ns_common:actions.update')}
								</Button>
							) : (
								<Fragment>
									<Button
										variant='outline'
										type='button'
										size='sm'
										className='border-dashed'
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
										<Icon
											name={isPending ? 'LoaderCircle' : 'Check'}
											className={isPending && 'animate-spin'}
										/>
										{isError ? t('ns_common:actions.retry') : t('ns_common:actions.save')}
									</Button>
									<Button
										type='button'
										size='sm'
										variant='secondary'
										onClick={() => handleResetDeliveryDetails(false, false)}
										disabled={isPending}>
										<Icon name='X' />
										{t('ns_common:actions.cancel')}
									</Button>
								</Fragment>
							)}
							{action && <Separator orientation='vertical' className='mx-2 h-8' />}
							<Button
								variant='outline'
								type='button'
								size='sm'
								onClick={() => {
									onCollapse()
									handleResetDeliveryDetails(false, false)
								}}>
								<Icon name='ChevronsUp' /> {t('ns_common:actions.fold')}
							</Button>
						</Div>

						{action && (
							<Div className='col-span-full inline-flex items-center'>
								<Icon
									name='BotMessageSquare'
									size={24}
									className='mr-2 duration-500 animate-in zoom-in-0 slide-in-from-bottom-2'
								/>
								&quot;
								<Typewriter
									className='text-sm italic'
									text={t('ns_inoutbound:description.duplicate_po_added')}
									typeSpeed={25}
									delay={0}
								/>
								&quot;
							</Div>
						)}
					</Div>
				</Form>
			</FormProvider>
		</Div>
	)
}

const Form = tw.form`flex flex-col gap-y-6`
const FieldSet = tw.fieldset`h-64 overflow-scroll`

export default TruckloadDeliveryDetailTable
