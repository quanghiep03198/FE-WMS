import { CommonActions } from '@/common/constants/enums'
import {
	Button,
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
	InputFieldControl
} from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { Fragment, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../-contexts/page-context'
import { GhostButton } from '../../-components/-shared/ghost-button'

const CreatePurchaseOrdersFormDialog: React.FC = () => {
	const { t } = useTranslation()
	const [open, setOpen] = useState<boolean>(false)
	const { event$ } = usePageContext()
	const form = useForm({})
	const { fields, append, remove, move } = useFieldArray({ control: form.control, name: 'outbound_purchase_orders' })

	event$.useSubscription(({ action, payload }) => {
		if (action !== CommonActions.CREATE) return
		setOpen(true)
	})

	const handleAppendField: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		// if (shouldAllowAdditionalSizes) e.preventDefault()

		append({})
		e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
						<Form>
							{fields.length > 0 ? (
								<Div className='space-y-6 rounded-md border border-dashed'>
									<Fragment>
										<ScrollShadow className='flex h-[50vh] flex-col gap-y-6 p-4'>
											{fields.map((field, index) => (
												<Div key={`po-item-${index}`} className='grid grid-cols-[1fr_1fr_auto] gap-x-2'>
													<InputFieldControl
														name={`purchase_orders.${index}.po`}
														placeholder={t('ns_erp:fields.po')}
													/>
													<InputFieldControl
														name={`purchase_orders.${index}.outbound_qty`}
														placeholder={t('ns_erp:fields.outbound_qty')}
													/>
													<GhostButton type='button' onClick={() => remove(index)}>
														<Icon name='X' />
													</GhostButton>
												</Div>
											))}
										</ScrollShadow>
										<Div className='flex justify-end gap-x-1 p-4'>
											<Button
												type='button'
												variant='outline'
												size='sm'
												className='border-dashed'
												onClick={handleAppendField}>
												<Icon name='Plus' /> {t('ns_common:actions.add')}
											</Button>
											<Button
												type='button'
												variant='destructive'
												size='sm'
												onClick={() => remove(fields.map((_, idx) => idx))}>
												<Icon name='X' /> {t('ns_inoutbound:labels.delete_all')}
											</Button>
										</Div>
									</Fragment>
								</Div>
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
											onClick={handleAppendField}>
											<Icon name='Plus' /> {t('ns_common:actions.add')}
										</Button>
									</EmptyContent>
								</Empty>
								// <Div className='flex flex-col items-center justify-center p-4 animate-in fade-in-0 zoom-in-90'>
								// 	<Icon
								// 		name='CircleFadingPlus'
								// 		size={40}
								// 		strokeWidth={1}
								// 		stroke='hsl(var(--muted-foreground))'
								// 		className='mb-4'
								// 	/>
								// 	<Typography className='mb-1 font-medium'>
								// 		{t('ns_inoutbound:description.no_added_size')}
								// 	</Typography>
								// 	<Typography variant='small' color='muted' className='col-span-full text-center'>
								// 		{t('ns_inoutbound:description.add_outbound_size')}
								// 	</Typography>
								// </Div>
							)}
							<DialogFooter>
								<Button type='submit'>
									<Icon name='Check' />
									{t('ns_common:actions.save_changes')}
								</Button>
								<DialogClose className={buttonVariants({ variant: 'secondary' })}>
									<Icon name='X' />
									{t('ns_common:actions.cancel')}
								</DialogClose>
							</DialogFooter>
						</Form>
					</FormProvider>
				</Div>
			</DialogContent>
		</Dialog>
	)
}

const Form = tw.form`flex flex-col gap-y-6`

export default CreatePurchaseOrdersFormDialog
