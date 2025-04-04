import { Form as FormProvider } from '@/components/ui'
import { MultiSelectFieldControl } from '@/components/ui/@hook-form/multi-select-field-control'
import { zodResolver } from '@hookform/resolvers/zod'
import { sortBy } from 'lodash'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useUpdateStockOutMutation } from '../../_apis/outbound-rfid.api'
import { usePageContext } from '../../_contexts/-page-context'
import { StandardOutboundFormValues, standardOutboundValidator } from '../../_schemas/outbound.schema'
import FormSubmission from './-form-submission'
import PurchaseOrderAutoComplete from './-purchase-order-autocomplete'

const StandardOutboundForm: React.FC = () => {
	const { scannedOrders } = usePageContext('scannedOrders')
	const { t } = useTranslation()
	const form = useForm<StandardOutboundFormValues>({
		resolver: zodResolver(standardOutboundValidator),
		defaultValues: {
			po: '',
			mo_no: []
		}
	})

	const { mutateAsync, isPending, isError } = useUpdateStockOutMutation(form.reset)

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit((data) => mutateAsync(data))}>
				<PurchaseOrderAutoComplete />
				<MultiSelectFieldControl
					name='mo_no'
					label={t('ns_erp:fields.mo_no')}
					datalist={sortBy(scannedOrders, 'mo_no')}
					labelField='mo_no'
					valueField='mo_no'
				/>
				<FormSubmission isPending={isPending} isError={isError} />
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`grid gap-y-6`

export default StandardOutboundForm
