import { Div, Form as FormProvider, InputFieldControl, SelectFieldControl } from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { sortBy } from 'lodash'
import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
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
			size_numcode: ''
		}
	})
	const { mutateAsync, isPending, isError } = useUpdateStockOutMutation(form.reset)

	const currentCommandNumber = useWatch({ control: form.control, name: 'mo_no' })
	const currentSize = useWatch({ control: form.control, name: 'size_numcode' })

	const sizeDataList = useMemo(() => {
		const currentCommandNumberData = scannedOrders.find((item) => item.mo_no === currentCommandNumber)
		return Array.isArray(currentCommandNumberData?.sizes)
			? sortBy(currentCommandNumberData.sizes, 'size_numcode')
			: []
	}, [scannedOrders, currentCommandNumber])

	const handleSubmit = async (data: DetailedOutBoundFormValues) => {
		const id = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await mutateAsync(data)
		} catch {
			toast.error(t('ns_common:notification.error'), { id })
		}
	}

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit(handleSubmit)}>
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
				<Div className='col-span-1'>
					<SelectFieldControl
						label='Size'
						name='size_numcode'
						datalist={sizeDataList}
						labelField='size_numcode'
						valueField='size_numcode'
						disabled={!currentCommandNumber}
						onValueChange={(value) => {
							form.setValue('size_qty', sizeDataList.find((item) => item.size_numcode === value)?.count ?? 0)
						}}
					/>
				</Div>
				<Div className='col-span-1'>
					<InputFieldControl
						label={t('ns_common:common_fields.quantity_with_limit', {
							limit: form.watch('size_qty'),
							defaultValue: null
						})}
						disabled={!currentSize}
						name='qty'
						type='number'
						placeholder='0'
					/>
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
