import { CommonActions } from '@/common/constants/enums'
import {
	Button,
	ButtonGroup,
	buttonVariants,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Div,
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	Typography
} from '@/components/ui'
import ScrollShadow, { ScrollShadowProps } from '@/components/ui/@custom/scroll-shadow'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateEffect } from 'ahooks'
import { Fragment, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../-contexts/page-context'
import { useCreateTruckloadDeliveryMutation } from '../-hooks/use-truckload-delivery-asm'
import { CreateDeliveryFormValues, createDeliverySchema } from '../-schemas'
import { GhostButton } from '../../-components/-shared/ghost-button'
import OutboundQtyInputFieldControl from './outbound-qty-field-control'
import PurchaseOrderFieldControl from './purchase-order-field-control'

const CreatePurchaseOrdersFormDialog: React.FC = () => {
	const { t } = useTranslation()
	const [open, setOpen] = useState<boolean>(false)
	const { event$ } = usePageContext()
	const form = useForm({
		resolver: zodResolver(createDeliverySchema)
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
		toast.loading(t('ns_common:notification.processing_request'), { id: 'create_truckload_delivery' })
		try {
			await mutateAsync(data)
			toast.success(t('ns_common:notification.success'), { id: 'create_truckload_delivery' })
			setOpen(false)
			form.reset()
		} catch {
			toast.error(t('ns_common:notification.error'), { id: 'create_truckload_delivery' })
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='max-w-2xl'>
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
											label={t('ns_erp:fields.license_plate')}
											name='license_plate'
											placeholder='xxx-xxxxx'
											onChange={(e) => form.setValue('license_plate', e.currentTarget.value.toUpperCase())}
										/>
										<InputFieldControl
											label={t('ns_erp:fields.container_number')}
											name='container_number'
											placeholder='xxxxxx'
											onChange={(e) =>
												form.setValue('container_number', e.currentTarget.value.toUpperCase())
											}
										/>
									</Div>
									<Div className='flex-1'>
										<Table className='w-full table-fixed'>
											<TableHeader className='sticky top-0 z-10 rounded-md'>
												<TableRow className='*:border-none *:bg-table-head *:text-table-head-foreground'>
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
													<TableRow key={field.id} className='*:border-none'>
														<TableCell>
															<Typography
																color='muted'
																className='h-9 py-2 align-middle text-sm before:content-["#"]'>
																{index + 1}
															</Typography>
														</TableCell>
														<TableCell className='self-start px-1'>
															<PurchaseOrderFieldControl
																data-index={index}
																data-action={CommonActions.CREATE}
																name={`outbound_purchase_orders.${index}.po`}
															/>
														</TableCell>
														<TableCell className='self-start px-1'>
															<OutboundQtyInputFieldControl
																data-index={index}
																data-action={CommonActions.CREATE}
																name={`outbound_purchase_orders.${index}.outbound_qty`}
															/>
														</TableCell>
														<TableCell>
															<GhostButton
																type='button'
																className='h-9 place-self-center self-center py-2'
																onClick={() => remove(index)}>
																<Icon name='X' />
															</GhostButton>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
											<TableFooter>
												<ButtonGroup className='h-fit w-fit' aria-label='Dynamic field controls'>
													<Button type='button' variant='outline' size='sm' onClick={() => append({})}>
														<Icon name='ListPlus' size={20} strokeWidth={1.5} />{' '}
														{t('ns_common:table.add_row')}
													</Button>
													<Button
														type='button'
														variant='outline'
														size='sm'
														onClick={() => remove(fields.map((_, idx) => idx))}>
														<Icon name='ListX' size={20} strokeWidth={1.5} />{' '}
														{t('ns_inoutbound:labels.delete_all')}
													</Button>
												</ButtonGroup>
											</TableFooter>
										</Table>
									</Div>
								</Fragment>
							) : (
								<Empty className='border border-dashed'>
									<EmptyHeader>
										<EmptyMedia variant='default' className='place-items place-content-center'>
											<Icon
												name='CircleFadingPlus'
												size={48}
												strokeWidth={1}
												stroke='hsl(var(--muted-foreground))'
											/>
										</EmptyMedia>
										<EmptyTitle>{t('ns_inoutbound:description.no_added_size')}</EmptyTitle>
										<EmptyDescription>{t('ns_inoutbound:description.add_outbound_size')}</EmptyDescription>
									</EmptyHeader>
									<EmptyContent>
										<Button
											type='button'
											variant='outline'
											size='sm'
											className='border-dashed'
											onClick={() => append({})}>
											<Icon name='Plus' /> {t('ns_common:actions.add')}
										</Button>
									</EmptyContent>
								</Empty>
							)}
							{fields.length > 0 && (
								<DialogFooter>
									<Button type='submit' disabled={isPending}>
										<Icon
											name={isPending ? 'LoaderCircle' : 'Check'}
											className={isPending && 'animate-spin'}
										/>
										{isError ? t('ns_common:actions.retry') : t('ns_common:actions.save')}
									</Button>
									<DialogClose className={buttonVariants({ variant: 'secondary' })}>
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
const TableHeader = tw.div`sticky top-0 z-10 bg-table-head text-table-headed-foreground`
const TableRow = tw.div`grid grid-cols-[2.5rem_1fr_1fr_2.5rem] items-start gap-x-2 [&>:first-child]:px-3`
const TableHead = tw.div`py-2 bg-table-head h-9 text-table-head-foreground font-medium`
const TableBody = tw(ScrollShadow)<ScrollShadowProps>`max-h-[50vh] flex-1`
const TableCell = tw.div`py-2 min-h-9`
const TableFooter = tw.div`rounded-md border border-dashed place-content-center place-items-center p-6 mt-6`

export default CreatePurchaseOrdersFormDialog
