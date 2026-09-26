'use no memo'

import { InputFieldControl } from '@components/forms/input'
import {
	Alert,
	AlertDescription,
	AlertTitle,
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	FieldGroup,
	Form as FormProvider,
	Icon,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
	Tooltip
} from '@components/ui'
import { useCreateStorageMutation } from '@features/warehouse/hooks/use-warehouse-storage-request'
import type { IWarehouse } from '@features/warehouse/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useKeyPress } from 'ahooks'
import { capitalize } from 'lodash-es'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { CreateStorageLocationFormValue } from '../../schemas/storage-location.schema'
import { createStorageLocationSchema } from '../../schemas/storage-location.schema'

const CreateLocationFormDialog: React.FC<{ data: IWarehouse }> = ({ data: warehouse }) => {
	const { t } = useTranslation()

	const form = useForm<CreateStorageLocationFormValue>({
		resolver: zodResolver(createStorageLocationSchema),
		defaultValues: {
			warehouse: warehouse?._id,
			locations: [{ name: '' }]
		}
	})

	const [open, setOpen] = useState<boolean>(false)
	const [activeIndex, setActiveIndex] = useState<number>(0)
	const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
	const { mutateAsync, isPending } = useCreateStorageMutation(warehouse?.name)

	const { append, remove, fields } = useFieldArray({ name: 'locations', control: form.control })

	useEffect(() => {
		if (warehouse) form.setValue('warehouse', warehouse._id)
	}, [warehouse])

	useKeyPress('ctrl.d', (e) => {
		e.preventDefault()
		append({ name: form.getValues(`locations.${activeIndex}.name`) })
	})

	useKeyPress('ctrl.l', (e) => {
		e.preventDefault()
		remove(activeIndex)
		const currentActiveIndex = activeIndex > 0 ? activeIndex - 1 : fields.length - 1
		console.log(currentActiveIndex)
		setActiveIndex(currentActiveIndex)
		inputRefs.current[fields[currentActiveIndex].id]?.focus()
	})

	const formSubmitHandler = async (data: CreateStorageLocationFormValue) => {
		await mutateAsync(data)
		setOpen((prev) => !prev)
		form.reset()
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				setOpen(open)
				if (!open) form.reset()
			}}>
			<DialogTrigger id='add-storage-location-dialog-trigger' className='hidden' />
			<DialogContent className='bg-popover w-full max-w-xl'>
				<DialogHeader>
					<DialogTitle className='lowercase first-letter:uppercase'>
						{t('ns_warehouse:form.add_storage_location_title')}
					</DialogTitle>
				</DialogHeader>
				<FormProvider {...form}>
					<form className='space-y-6' onSubmit={form.handleSubmit(formSubmitHandler)}>
						<FieldGroup className='max-h-[60vh] overflow-y-auto'>
							<Table className='table-fixed'>
								<colgroup>
									<col className='w-4' />
									<col className='w-24' />
									<col className='w-8' />
								</colgroup>

								<TableHeader className='[&_th]:bg-table-head sticky top-0 z-10'>
									<TableRow>
										<TableHead align='left'>#</TableHead>
										<TableHead align='left'>{t('ns_warehouse:fields.storage_name')}</TableHead>
										<TableHead align='left'>{t('ns_common:common_fields.actions')}</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{fields.length === 0 ? (
										<TableRow>
											<TableCell colSpan={3} className='text-muted-foreground h-24 text-center'>
												{t('ns_common:table.no_data')}
											</TableCell>
										</TableRow>
									) : (
										fields.map((field, index) => (
											<TableRow
												key={field.id}
												className='[&:has(input[aria-invalid=true])>td]:bg-destructive/5 [&:focus-within>td_input[aria-invalid=true]]:bg-destructive/5! [&:focus-within>td_input]:bg-table-row-active! [&:focus-within>td]:bg-table-row-active [&_input]:bg-inherit'
												onFocus={() => setActiveIndex(index)}>
												<TableCell>{index + 1}</TableCell>
												<TableCell className='p-0!'>
													<InputFieldControl
														key={field.id}
														placeholder={capitalize(
															t('ns_common:form_placeholder.fill', {
																object: t('ns_warehouse:fields.storage_name')
															})
														)}
														ref={(e) => {
															inputRefs.current[field.id] = e
														}}
														name={`locations.${index}.name`}
														className='aria-invalid:bg-destructive/5! aria-invalid:placeholder:text-destructive! h-full rounded-none border-none bg-inherit! shadow-none transition-none'
														errorMessageVariant='tooltip'
														onFocus={() => setActiveIndex(index)}
														onChange={(e) =>
															form.setValue(`locations.${index}.name`, e.target.value.toUpperCase())
														}
													/>
												</TableCell>
												<TableCell>
													<Tooltip message={'Ctrl+L'} triggerProps={{ asChild: true }}>
														<Button variant='ghost' size='xs' onClick={() => remove(index)}>
															<Icon name='X' size={14} /> {t('ns_common:actions.delete')}
														</Button>
													</Tooltip>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
								<TableFooter className='[&_th]:bg-table-head sticky bottom-0 z-10 [&_th]:border-none'>
									<TableRow>
										<TableHead colSpan={2} align='left' className='border-none'>
											<Tooltip message={'Ctrl+D'} triggerProps={{ asChild: true }}>
												<Button type='button' variant='ghost' onClick={() => append({ name: '' })}>
													<Icon name='ListPlus' />
													{t('ns_common:table.add_row')}
												</Button>
											</Tooltip>
										</TableHead>
										<TableHead align='left'>
											{t('ns_common:table.total_rows', { count: fields.length })}
										</TableHead>
									</TableRow>
								</TableFooter>
							</Table>
						</FieldGroup>
						<Alert>
							<Icon name='Info' size={18} />
							<AlertTitle>{t('ns_common:titles.attention')}</AlertTitle>
							<AlertDescription>{t('ns_warehouse:form.storage_location_note')}</AlertDescription>
						</Alert>

						<DialogFooter className='col-span-full'>
							<DialogClose asChild>
								<Button type='button' variant='outline' onClick={() => form.reset()}>
									{t('ns_common:actions.cancel')}
								</Button>
							</DialogClose>
							<Button type='submit' disabled={isPending}>
								{isPending && <Icon name='LoaderCircle' className='animate-spin' />}
								{t('ns_common:actions.submit')}
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}

export default CreateLocationFormDialog
