import { CommonActions } from '@/common/constants/enums'
import { Button, Div, Icon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import { Typewriter } from '@/components/ui/@custom/type-writter'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { pick } from 'lodash'
import React, { useEffect } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../-contexts/page-context'
import OutboundQtyInputFieldControl from './outbound-qty-field-control'
import PurchaseOrderFieldControl from './purchase-order-field-control'

const TruckloadDeliveryDetailTable: React.FC<Record<'data', ITruckloadDelivery['delivery_details']>> = ({ data }) => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const form = useForm({
		// resolver: zodResolver()
	})

	const { fields, append } = useFieldArray({ control: form.control, name: 'delivery_details' })

	useEffect(() => {
		form.reset({
			delivery_details: data
				.map((item) => pick(item, ['po', 'outbound_qty']))
				.concat(form.getValues('delivery_details'))
		})
	}, [data])

	return (
		<Div className='h-80overflow-scroll relative rounded-md border bg-background'>
			<FormProvider {...form}>
				<Form>
					<Table className='w-full table-fixed [&_td:has(input)]:!p-1 [&_td>span]:line-clamp-1 [&_td]:h-12 [&_td]:border-x-0 [&_th>span]:line-clamp-1 [&_th]:border-x-0 [&_th]:bg-table-head'>
						<TableHeader className='sticky top-0 z-10'>
							<TableRow>
								<TableHead align='left' title={t('ns_erp:fields.po')}>
									<span>{t('ns_erp:fields.po')}</span>
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
							{fields.map((item, index) => (
								<TableRow key={index.toString()}>
									<TableCell align='left' aria-readonly={false}>
										<PurchaseOrderFieldControl
											name={`delivery_details.${index}.po`}
											data-action={CommonActions.CREATE}
											className='min-h-full rounded-sm border-transparent shadow-none focus:border-primary'
											data-icon={false}
											data-index={index}
										/>
									</TableCell>
									<TableCell align='left'>
										<span>{data[index]?.factory_shoes_style}</span>
									</TableCell>
									<TableCell align='left'>
										<span>{data[index]?.color_sn}</span>
									</TableCell>
									<TableCell align='left'>
										<OutboundQtyInputFieldControl
											name={`delivery_details.${index}.outbound_qty`}
											className='min-h-full rounded-sm border-transparent shadow-none focus:border-primary'
											data-action={CommonActions.CREATE}
											data-index={index}
										/>
									</TableCell>
									<TableCell align='right'>
										<Div className='flex items-center'>
											<Button
												variant='ghost'
												size='sm'
												// onClick={() =>
												// 	event$.emit({
												// 		action: CommonActions.UPDATE,
												// 		payload: pick(item, ['id', 'po', 'outbound_qty'])
												// 	})
												// }
											>
												{t('ns_common:actions.update')}
											</Button>
											<Button variant='ghost' size='sm' className='text-destructive hover:text-destructive'>
												{t('ns_common:actions.delete')}
											</Button>
										</Div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Div className='m-4 grid place-content-center place-items-center gap-y-4 rounded-md border border-dashed p-4'>
						<Button variant='outline' type='button' size='sm' onClick={() => append({})}>
							<Icon name='ListPlus' /> {t('ns_common:table.add_row')}
						</Button>
						<Div className='col-span-full inline-flex items-center'>
							<Icon
								name='BotMessageSquare'
								size={24}
								className='mr-2 duration-500 animate-in zoom-in-0 slide-in-from-bottom-2'
							/>
							&quot;
							<Typewriter
								className='text-sm italic'
								text={'Do not add duplicate purchase orders and double check the outbound quantities.'}
								delay={200}
							/>
							&quot;
						</Div>
					</Div>
				</Form>
			</FormProvider>
		</Div>
	)
}

const Form = tw.form`flex flex-col gap-y-6`

export default TruckloadDeliveryDetailTable
