import { CommonActions } from '@common/constants/enums'
import { Div } from '@components/customs/div'
import { Typewriter } from '@components/customs/type-writter'
import { Typography } from '@components/customs/typography'
import { InputFieldControl } from '@components/forms/input'
import { Button, buttonVariants } from '@components/ui/button'
import { ButtonGroup } from '@components/ui/button-group'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@components/ui/dialog'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@components/ui/empty'
import { Form as FormProvider } from '@components/ui/form'
import { Icon } from '@components/ui/icon'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateEffect } from 'ahooks'
import { Fragment, useRef, useState } from 'react'
import { type Resolver, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { GhostButton } from '../../../components/shared/ghost-button'
import { usePageContext } from '../contexts/page-context'
import { useCreateTruckloadDeliveryMutation } from '../hooks/use-truckload-delivery-request'
import type { CreateDeliveryFormValues } from '../schemas'
import { createDeliverySchema } from '../schemas'
import OutboundQtyInputFieldControl from './outbound-qty-field-control'
import PurchaseOrderFieldControl from './purchase-order-field-control'

const CreatePurchaseOrdersFormDialog: React.FC = () => {
	const { t } = useTranslation()
	const [open, setOpen] = useState<boolean>(false)
	const { event$ } = usePageContext()
	const form = useForm<CreateDeliveryFormValues>({
		resolver: zodResolver(createDeliverySchema) as Resolver<CreateDeliveryFormValues>
	})
	const { fields, append, remove } = useFieldArray({ control: form.control, name: 'outbound_purchase_orders' })
	const { mutateAsync, isPending, isError } = useCreateTruckloadDeliveryMutation()

	const scrollRef = useRef<HTMLDivElement | null>(null)

	event$.useSubscription(({ action }) => {
		if (action !== CommonActions.CREATE) return
		setOpen(true)
	})

	useUpdateEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({
				top: scrollRef.current.scrollHeight,
				behavior: 'smooth'
			})
		}
	}, [fields.length])

	const handleCreateSubmit = async (data: CreateDeliveryFormValues) => {
		await mutateAsync(data)
		toast.success(t('ns_common:notification.success'), { id: 'create_truckload_delivery' })
		setOpen(false)
		form.reset({
			license_plate: null,
			container_number: null,
			outbound_purchase_orders: []
		})
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='max-w-3xl'>
				<DialogHeader>
					<DialogTitle>{t('ns_inoutbound:titles.create_truckload_delivery')}</DialogTitle>
					<DialogDescription>{t('ns_inoutbound:description.create_truckload_delivery')}</DialogDescription>
				</DialogHeader>
				<Div className='grid gap-6'>
					<FormProvider {...form}>
						<Form onSubmit={form.handleSubmit(handleCreateSubmit)}>
							{fields.length > 0 ? (
								<Fragment>
									<Div className='grid grid-cols-2 gap-x-2'>
										<InputFieldControl
											description={t('ns_inoutbound:description.container_number_field')}
											label={t('ns_erp:fields.container_number')}
											name='container_number'
											placeholder='e.g., ABCU1234567'
											onChange={(e) => {
												form.setValue('container_number', e.currentTarget.value.toUpperCase())
											}}
										/>
										<InputFieldControl
											description={t('ns_inoutbound:description.license_plate_field')}
											label={t('ns_erp:fields.license_plate')}
											name='license_plate'
											placeholder='e.g., ABC-12345'
											onChange={(e) => form.setValue('license_plate', e.currentTarget.value.toUpperCase())}
										/>
									</Div>
									<Div className='flex-1'>
										<Table className='w-full table-fixed'>
											<TableHeader className='overflow-clip rounded-md'>
												<TableRow>
													<TableHead align='left'>#</TableHead>
													<TableHead align='left' className='px-1'>
														{t('ns_erp:fields.po')}
													</TableHead>
													<TableHead align='left' className='px-1'>
														{t('ns_erp:fields.outbound_qty')}
													</TableHead>
													<TableHead align='center'>
														<Typography className='sr-only'>Actions</Typography>
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody ref={scrollRef}>
												{fields.map((field, index) => (
													<TableRow className='*:border-none' key={field.id}>
														<TableCell>
															<Typography
																className='h-9 py-2 align-middle text-sm before:content-["#"]'
																color='muted'>
																{index + 1}
															</Typography>
														</TableCell>
														<TableCell className='self-start px-1'>
															<PurchaseOrderFieldControl
																data-action={CommonActions.CREATE}
																data-index={index}
																name={`outbound_purchase_orders.${index}.po`}
															/>
														</TableCell>
														<TableCell className='self-start px-1'>
															<OutboundQtyInputFieldControl
																data-action={CommonActions.CREATE}
																data-index={index}
																name={`outbound_purchase_orders.${index}.outbound_qty`}
															/>
														</TableCell>
														<TableCell>
															<GhostButton
																className='h-9 place-self-center self-center py-2'
																type='button'
																onClick={() => remove(index)}>
																<Icon name='X' />
															</GhostButton>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
											<TableFooter>
												<ButtonGroup aria-label='Dynamic field controls' className='h-fit w-fit'>
													<Button
														size='sm'
														type='button'
														variant='outline'
														onClick={() =>
															append({ po: '', outbound_qty: 0, max_outbound_qty: Infinity })
														}>
														<Icon name='ListPlus' size={20} strokeWidth={1.5} />{' '}
														{t('ns_common:table.add_row')}
													</Button>
													<Button
														size='sm'
														type='button'
														variant='outline'
														onClick={() => remove(fields.map((_, idx) => idx))}>
														<Icon name='ListX' size={20} strokeWidth={1.5} />{' '}
														{t('ns_inoutbound:labels.delete_all')}
													</Button>
												</ButtonGroup>
												<Div className='col-span-full inline-flex items-center'>
													<Icon
														className='animate-in zoom-in-0 slide-in-from-bottom-2 mr-2 duration-500'
														name='BotMessageSquare'
														size={24}
													/>
													&quot;
													<Typewriter
														className='text-sm italic'
														delay={350}
														text={t('ns_inoutbound:description.duplicate_po_added')}
														typeSpeed={20}
													/>
													&quot;
												</Div>
											</TableFooter>
										</Table>
									</Div>
								</Fragment>
							) : (
								<Empty className='border border-dashed'>
									<EmptyHeader className='w-full max-w-md'>
										<EmptyMedia className='place-items place-content-center' variant='default'>
											<Icon
												name='CircleFadingPlus'
												size={48}
												stroke='var(--muted-foreground)'
												strokeWidth={1}
											/>
										</EmptyMedia>
										<EmptyTitle>{t('ns_inoutbound:description.no_dispatch_order_item_added')}</EmptyTitle>
										<EmptyDescription className='w-full'>
											{t('ns_inoutbound:description.no_dispatch_order_item_added_caption')}
										</EmptyDescription>
									</EmptyHeader>
									<EmptyContent>
										<Button
											className='border-dashed'
											size='sm'
											type='button'
											variant='outline'
											onClick={() => append({ po: '', outbound_qty: 0, max_outbound_qty: Infinity })}>
											<Icon name='Plus' /> {t('ns_common:actions.add')}
										</Button>
									</EmptyContent>
								</Empty>
							)}
							{fields.length > 0 && (
								<DialogFooter>
									<Button disabled={isPending} type='submit'>
										<Icon
											aria-busy={isPending}
											className='aria-busy:animate-spin'
											name={isPending ? 'LoaderCircle' : 'Check'}
										/>
										{isError ? t('ns_common:actions.retry') : t('ns_common:actions.save')}
									</Button>
									<DialogClose
										className={buttonVariants({ variant: 'secondary' })}
										onClick={() =>
											form.reset({
												license_plate: null,
												container_number: null,
												outbound_purchase_orders: []
											})
										}>
										<Icon name='X' />
										{t('ns_common:actions.cancel')}
									</DialogClose>
								</DialogFooter>
							)}
						</Form>
					</FormProvider>
				</Div>
			</DialogContent>
		</Dialog>
	)
}

const Form = tw.form`flex flex-col gap-y-6 *:text-sm`
const Table = tw.div`flex flex-col relative`
const TableHeader = tw.div`sticky top-0 z-10 bg-accent text-accent-foreground`
const TableRow = tw.div`grid grid-cols-[2.5rem_1fr_1fr_2.5rem] items-start gap-x-2 *:first:px-3`
const TableHead = tw.div`py-2 h-9 font-medium bg-accent`
const TableBody = tw.div`max-h-[40vh] scroll-fade flex-1`
const TableCell = tw.div`py-2 min-h-9 has-[input]:px-0`
const TableFooter = tw.div`rounded-md border border-dashed place-content-center place-items-center p-6 mt-6 flex flex-col justify-center items-center space-y-6`

export default CreatePurchaseOrdersFormDialog
