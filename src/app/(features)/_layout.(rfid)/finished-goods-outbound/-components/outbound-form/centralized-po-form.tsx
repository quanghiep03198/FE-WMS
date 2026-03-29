'use no memo'

import { Form as FormProvider, Icon, MultiSelectFieldControl, Tooltip } from '@/components/ui'
import { Alert, AlertClose, AlertContent, AlertDescription, AlertTitle } from '@/components/ui/@custom/alert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useResetState } from 'ahooks'
import type { AxiosError } from 'axios'
import { HttpStatusCode } from 'axios'
import { sortedUniqBy } from 'lodash-es'
import { Fragment, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../../-contexts/page-context'
import { useUpdateStockOutMutation } from '../../-hooks/use-rfid-outbound-asm'
import type { StandardOutboundFormValues } from '../../-schemas'
import { standardOutboundValidator } from '../../-schemas'
import FormSubmission from './form-submission'
import PurchaseOrderAutoComplete from './purchase-order-autocomplete'

const CentralizedPoOutboundForm: React.FC = () => {
	const [searchTerm, setSearchTerm, resetSearchTerm] = useResetState<string>('')
	const { scannedOrders } = usePageContext('scannedOrders')
	const { t } = useTranslation()
	const form = useForm<StandardOutboundFormValues>({
		resolver: zodResolver(standardOutboundValidator),
		defaultValues: {
			po: '',
			mo_no: []
		},
		mode: 'onChange'
	})

	const { mutateAsync, isPending, isError, error, reset } = useUpdateStockOutMutation(form.reset)

	const filteredOrders = useMemo(() => {
		if (!Array.isArray(scannedOrders)) return []
		const result = scannedOrders.filter(({ mo_no }) =>
			mo_no.trim().toLowerCase().includes(searchTerm.trim().toLowerCase())
		)
		const selectedOrders = form.watch('mo_no').map((value) => ({ mo_no: value }))
		return sortedUniqBy([...result, ...selectedOrders], (item) => item.mo_no)
	}, [searchTerm, scannedOrders])

	return (
		<Fragment>
			{createPortal(
				<Alert data-state={isError && error?.status === HttpStatusCode.BadRequest ? 'open' : 'closed'}>
					<Icon
						name='TriangleAlert'
						size={40}
						strokeWidth={2}
						className='fill-destructive-foreground stroke-destructive'
					/>
					<AlertContent>
						<AlertTitle>{t('ns_common:titles.caution')}</AlertTitle>
						<AlertDescription>
							{(error as AxiosError<ResponseBody<void>>)?.response?.data?.message}
						</AlertDescription>
					</AlertContent>
					<Tooltip
						message={t('ns_common:actions.dismiss')}
						triggerProps={{ asChild: true }}
						contentProps={{ side: 'left' }}>
						<AlertClose onClick={() => reset()}>
							<Icon name='X' />
						</AlertClose>
					</Tooltip>
				</Alert>,
				document.body
			)}
			<FormProvider {...form}>
				<Form
					onSubmit={form.handleSubmit((data) =>
						mutateAsync(data).then(() => {
							form.reset()
							resetSearchTerm()
						})
					)}>
					<PurchaseOrderAutoComplete />
					<MultiSelectFieldControl
						name='mo_no'
						label={t('ns_erp:fields.mo_no')}
						shouldFilter={false}
						search={searchTerm}
						onInput={(value) => setSearchTerm(value)}
						datalist={filteredOrders}
						labelField='mo_no'
						valueField='mo_no'
					/>

					<FormSubmission isPending={isPending} isError={isError} />
				</Form>
			</FormProvider>
		</Fragment>
	)
}

const Form = tw.form`grid gap-y-6`

export default CentralizedPoOutboundForm
