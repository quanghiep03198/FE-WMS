import { useSearchPurchaseOrderQuery } from '@/app/(features)/_apis/use-order.api'
import { cn } from '@/common/utils/cn'
import { Button, ComboboxFieldControl, Form as FormProvider, Icon } from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useUpdateStockOutMutation } from '../../_apis/outbound-rfid.api'
import { outboundValidator } from '../../_schemas/outbound.schema'

const OutboundForm: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState<string>('')
	const { t } = useTranslation()
	const form = useForm({
		resolver: zodResolver(outboundValidator),
		defaultValues: {
			po: ''
		}
	})

	const { data: purchaseOrders } = useSearchPurchaseOrderQuery(searchTerm)
	const { mutateAsync, isPending, isError } = useUpdateStockOutMutation()

	const handleSubmit = async (data) => {
		const id = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await mutateAsync(data)
			toast.success(t('ns_common:notification.success'), { id })
		} catch {
			toast.error(t('ns_common:notification.error'), { id })
		}
	}

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit(handleSubmit)}>
				<ComboboxFieldControl
					name='po'
					label={t('ns_erp:fields.po')}
					datalist={purchaseOrders}
					onInput={setSearchTerm}
					labelField='po'
					valueField='po'
				/>
				<Button type='submit' size='lg' disabled={isPending}>
					<Icon
						name={isPending ? 'LoaderCircle' : 'Check'}
						role='img'
						className={cn(isPending && 'animate-spin')}
					/>
					{isError ? t('ns_common:actions.retry') : t('ns_common:actions.submit')}
				</Button>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`flex items-stretch gap-y-6 flex-col border rounded-md p-4`

export default OutboundForm
