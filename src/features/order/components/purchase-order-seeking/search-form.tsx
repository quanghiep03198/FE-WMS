import { Button, Div, Form as FormProvider, Icon } from '@components/ui'
import useQueryParams from '@hooks/use-query-params'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useSearchPoHistory } from '../../hooks/use-search-po-history'
import { OrderSearchFieldControl } from './order-search-field-control'

const SearchForm: React.FC = () => {
	const { t } = useTranslation()
	const { searchParams, setParams } = useQueryParams<{ po?: string }>()

	const form = useForm({
		defaultValues: {
			po: searchParams.po ?? ''
		}
	})

	const [recentlySearch, setRecentlySearch] = useSearchPoHistory()

	useEffect(() => {
		if (!searchParams.po) form.reset()
	}, [searchParams])

	return (
		<FormProvider {...form}>
			<Form
				className='flex flex-col justify-center gap-y-10'
				onSubmit={form.handleSubmit((data) => {
					setParams(data)
					setRecentlySearch([...new Set([data.po, ...recentlySearch])].filter((item) => item).slice(0, 11))
				})}>
				<Div className='flex items-center gap-x-2'>
					<OrderSearchFieldControl />
					<Button id='search-po-button' type='submit' className='hidden'>
						<Icon name='Search' />
						{t('ns_common:actions.search')}
					</Button>
				</Div>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`w-full grid gap-y-10`

export default SearchForm
