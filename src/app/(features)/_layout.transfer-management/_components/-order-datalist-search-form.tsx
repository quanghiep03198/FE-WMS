import useQueryParams from '@/common/hooks/use-query-params'
import { Button, ComboboxFieldControl, DatePickerFieldControl, Div, Form as FormProvider, Icon } from '@/components/ui'
import { TransferOrderService } from '@/services/transfer-order.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { addMonths } from 'date-fns'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { searchFormSchema, SearchFormValues } from '../_schemas/-search-customer-brand.schema'

const CUSTOMER_BRAND_PROVIDE_TAG = 'CUSTOMER_BRAND' as const

const OrderDatalistSearchForm: React.FC = () => {
	const { t } = useTranslation()
	const form = useForm<SearchFormValues>({
		resolver: zodResolver(searchFormSchema)
	})
	const { searchParams, setParams } = useQueryParams<SearchFormValues>({
		time_range: { from: addMonths(new Date(), -1), to: new Date() } satisfies DateRange
	})

	const [customerBrandSearchTerm, setCustomerBrandSearchTerm] = useState<string>('')

	const { data: brands, isLoading } = useQuery({
		queryKey: [CUSTOMER_BRAND_PROVIDE_TAG, customerBrandSearchTerm],
		queryFn: () => TransferOrderService.searchOrderCustomer(customerBrandSearchTerm),
		select: (response) => response.metadata
	})

	useEffect(() => {
		form.reset(searchParams)
	}, [])

	return (
		<FormProvider {...form}>
			<Form
				onSubmit={form.handleSubmit((data) => {
					setParams({
						...data,
						time_range: JSON.stringify(data.time_range)
					})
				})}>
				<Div className='col-span-5 sm:col-span-full'>
					<DatePickerFieldControl name='time_range' control={form.control} calendarProps={{ mode: 'range' }} />
				</Div>
				<Div className='col-span-5 sm:col-span-full'>
					<ComboboxFieldControl
						name='brand'
						form={form}
						data={brands}
						loading={isLoading}
						valueField='custbrand_id'
						labelField='brand_name'
						shouldFilter={false}
						onInput={debounce((value) => setCustomerBrandSearchTerm(value), 200)}
					/>
				</Div>
				<Div className='col-span-2 sm:col-span-full sm:flex sm:justify-end'>
					<Button className='gap-x-2 sm:w-full'>
						<Icon name='Search' /> {t('ns_common:actions.search')}
					</Button>
				</Div>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`xl:max-w-1/2 max-w-full grid grid-cols-12 items-end gap-x-2 sm:max-w-full gap-y-3`

export default OrderDatalistSearchForm
