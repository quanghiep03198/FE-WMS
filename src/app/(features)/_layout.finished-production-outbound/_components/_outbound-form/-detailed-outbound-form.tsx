'use no memo'
import {
	Button,
	Div,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	SelectFieldControl,
	Typography
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { sortBy } from 'lodash'
import { Fragment, useMemo } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useUpdateStockOutMutation } from '../../_apis/outbound-rfid.api'
import { usePageContext } from '../../_contexts/-page-context'
import { DetailedOutBoundFormValues, detailedOutboundValidator } from '../../_schemas/outbound.schema'
import FormSubmission from './-form-submission'
import PurchaseOrderAutoComplete from './-purchase-order-autocomplete'

const DetailedOutboundForm = () => {
	const { t } = useTranslation()
	const { scannedOrders } = usePageContext('scannedOrders')

	const form = useForm<DetailedOutBoundFormValues>({
		resolver: zodResolver(detailedOutboundValidator),
		defaultValues: {
			po: '',
			mo_no: '',
			sizes: []
		}
	})
	const { fields, append, remove } = useFieldArray({ control: form.control, name: 'sizes' })
	const { mutateAsync, isPending, isError } = useUpdateStockOutMutation(form.reset)

	const currentCommandNumber = useWatch({ control: form.control, name: 'mo_no' })
	// const currentSize = useWatch({ control: form.control, name: 'size_numcode' })

	const sizeDataList = useMemo(() => {
		const currentCommandNumberData = scannedOrders.find((item) => item.mo_no === currentCommandNumber)
		return Array.isArray(currentCommandNumberData?.sizes)
			? sortBy(currentCommandNumberData.sizes, 'size_numcode')
			: []
	}, [scannedOrders, currentCommandNumber])

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit((data) => console.log(data))}>
				<Div className='col-span-1'>
					<PurchaseOrderAutoComplete />
				</Div>
				<Div className='col-span-1'>
					<SelectFieldControl
						label={t('ns_erp:fields.mo_no')}
						name='mo_no'
						datalist={sortBy(scannedOrders, 'mo_no')}
						labelField='mo_no'
						valueField='mo_no'
					/>
				</Div>
				<Div
					as='fieldset'
					className='relative col-span-full grid grid-cols-2 gap-x-2 gap-y-6 rounded-md border border-dashed p-4'>
					{fields.length > 0 ? (
						fields.map((field, index) => (
							<Fragment key={field.id}>
								<Div className='flex-1'>
									<SelectFieldControl
										name={`sizes.${index}.size_numcode`}
										datalist={sizeDataList}
										labelField='size_numcode'
										valueField='size_numcode'
										disabled={!currentCommandNumber}
										placeholder='Select size'
										onValueChange={(value) => {
											const maxSizeQty = sizeDataList.find((item) => item.size_numcode === value)?.count ?? 0
											form.setValue(`sizes.${index}.size_qty`, maxSizeQty)
										}}
									/>
								</Div>
								<Div className='flex-1'>
									<InputFieldControl
										name={`sizes.${index}.qty`}
										type='number'
										placeholder={t('ns_common:common_fields.quantity_with_limit', {
											limit: form.watch(`sizes.${index}.size_qty`) || 0,
											defaultValues: `Quantity (max ${form.watch(`sizes.${index}.size_qty`)})`
										})}
									/>
								</Div>
								<button
									onClick={() => remove(index)}
									className='absolute right-0 top-0 inline-flex size-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-accent text-muted-foreground opacity-0 transition-[colors_opacity] duration-200 group-hover/field-item:opacity-100 hover:text-foreground'>
									<Icon name='X' size={14} />
								</button>
							</Fragment>
						))
					) : (
						<Div className='col-span-full flex flex-col items-center justify-center'>
							<Icon
								name='CircleFadingPlus'
								size={40}
								strokeWidth={1}
								stroke='hsl(var(--muted-foreground))'
								className='mb-4'
							/>
							<Typography className='font-medium'>No size</Typography>
							<Typography variant='small' color='muted' className='col-span-full text-center'>
								Add size and quantity for this order to perform the outbound process.
							</Typography>
						</Div>
					)}
					<Div className='col-span-full flex justify-center'>
						<Button size='sm' type='button' onClick={() => append({})}>
							<Icon name='Plus' role='img' /> {t('ns_common:actions.add')}
						</Button>
					</Div>
				</Div>
				<Div className='col-span-full'>
					<FormSubmission isPending={isPending} isError={isError} />
				</Div>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`grid grid-cols-2 gap-x-2 gap-y-6`

export default DetailedOutboundForm
