'use no memo'
import { Button, Div, Form as FormProvider, Icon, InputFieldControl, SelectFieldControl } from '@/components/ui'
import { DndContext } from '@dnd-kit/core'
import { zodResolver } from '@hookform/resolvers/zod'
import { sortBy } from 'lodash'
import { useMemo } from 'react'
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

				<DndContext>
					{fields.map((field, index) => (
						<Div
							className='group/field-item relative col-span-full flex items-center justify-between gap-2'
							key={field.id}>
							{/* <Icon name='GripVertical' className='stroke-muted-foreground' /> */}
							<Div className='flex-1'>
								<SelectFieldControl
									name={`sizes[${index}].size_numcode`}
									datalist={sizeDataList}
									labelField='size_numcode'
									valueField='size_numcode'
									disabled={!currentCommandNumber}
								/>
							</Div>
							<Div className='flex-1'>
								<InputFieldControl name={`sizes[${index}].qty`} type='number' placeholder='0' />
							</Div>
							<button
								onClick={() => remove(index)}
								className='absolute right-0 top-0 inline-flex size-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-accent text-muted-foreground opacity-0 transition-[colors_opacity] duration-200 group-hover/field-item:opacity-100 hover:text-foreground'>
								<Icon name='X' size={14} />
							</button>
						</Div>
					))}
				</DndContext>
				<Div className='col-span-full'>
					<Button variant='ghost' type='button' className='w-full' onClick={() => append({})}>
						<Icon name='Plus' role='img' /> {t('ns_common:actions.add')}
					</Button>
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
