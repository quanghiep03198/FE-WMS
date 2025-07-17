import useQueryParams from '@/common/hooks/use-query-params'
import { Button, Div, Form as FormProvider, Icon } from '@/components/ui'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import WarehouseDataTypeFieldControl from './data-type-field-control'
import { OrderSearchFieldControl } from './order-search-field-control'

const SearchForm: React.FC = () => {
	const { t } = useTranslation()
	const { searchParams, setParams } = useQueryParams<{ order: string }>()
	const form = useForm({
		defaultValues: {
			order: searchParams.order,
			dataType: searchParams.type
		}
	})

	return (
		<FormProvider {...form}>
			<Form
				className='flex flex-col justify-center'
				onSubmit={form.handleSubmit((data) => setParams({ order: data.order, type: data.dataType }))}>
				<Div className='flex items-center gap-x-2'>
					<OrderSearchFieldControl />
					<Button size='lg'>
						<Icon name='Search' />
						{t('ns_common:actions.search')}
					</Button>
				</Div>
				<WarehouseDataTypeFieldControl />
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`gap-y-6 max-w-3xl mx-auto`

export default SearchForm
