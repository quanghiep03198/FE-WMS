import { useSearchPurchaseOrderQuery } from '@/app/(features)/_apis/use-order.api'
import { cn } from '@/common/utils/cn'
import {
	Button,
	Checkbox,
	ComboboxFieldControl,
	Div,
	Form as FormProvider,
	Icon,
	Label,
	Separator,
	Typography
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useResetState } from 'ahooks'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useUpdateStockOutMutation } from '../../_apis/outbound-rfid.api'
import { outboundValidator } from '../../_schemas/outbound.schema'

const OutboundForm: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState<string>('')
	const [isConfirmed, setIsConfirmed, resetConfirm] = useResetState<CheckedState>(false)
	const checkboxId = useId()
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
					description={t('ns_inoutbound:description.po_outbound')}
					datalist={purchaseOrders}
					onInput={setSearchTerm}
					labelField='po'
					valueField='po'
				/>
				<Div className='col-span-full space-y-4'>
					<Div className='space-y-1.5 leading-none'>
						<Typography className='inline-flex items-center gap-x-2 font-semibold text-warning'>
							<Icon name='TriangleAlert' /> {t('ns_common:titles.caution')}
						</Typography>
						<Typography variant='small'>
							{t('ns_inoutbound:notification.stock_out_submission_caution')}
						</Typography>
					</Div>
					<Separator />
					<Div className='inline-flex items-center gap-x-2'>
						<Checkbox id={checkboxId} checked={isConfirmed} onCheckedChange={(value) => setIsConfirmed(value)} />
						<Label htmlFor=''>{t('ns_common:confirmation.understand_and_proceed')}</Label>
					</Div>
				</Div>
				<Button type='submit' size='lg' disabled={isPending || !isConfirmed}>
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

const Form = tw.form`flex items-stretch gap-y-6 flex-col border rounded-md p-6`

export default OutboundForm
