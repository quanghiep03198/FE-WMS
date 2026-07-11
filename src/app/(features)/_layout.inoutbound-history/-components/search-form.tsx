import { cn } from '@/common/utils/cn'
import { Button, Div, Form as FormProvider, Icon, SelectFieldControl } from '@/components/ui'
import useQueryParams from '@/hooks/use-query-params'
import { useUpdateEffect } from 'ahooks'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useGetInboundHistoryQuery, useGetOutboundHistoryQuery } from '../-hooks/use-inoutbound-history-asm'
import { RFIDDataType } from '../../_layout.(rfid)/-constants'
import WarehouseDataTypeFieldControl from './data-type-field-control'
import { OrderSearchFieldControl } from './order-search-field-control'

const SearchForm: React.FC = () => {
	const { t } = useTranslation()
	const { searchParams, setParams } = useQueryParams<{ order?: string; type: RFIDDataType }>()
	const { refetch: refetchInboundHistory } = useGetInboundHistoryQuery()
	const { refetch: refetchOutboundHistory } = useGetOutboundHistoryQuery()

	const form = useForm({
		defaultValues: {
			type: searchParams.type ?? RFIDDataType.INBOUND,
			order: searchParams.order ?? ''
		}
	})

	const hasSearch = searchParams.order && Object.values(RFIDDataType).includes(searchParams.type)

	const refetch = () => {
		if (searchParams.type === RFIDDataType.INBOUND) {
			refetchInboundHistory()
		} else if (searchParams.type === RFIDDataType.OUTBOUND) {
			refetchOutboundHistory()
		} else return
	}

	useUpdateEffect(() => {
		if (!hasSearch) form.setValue('order', '')
	}, [hasSearch])

	return (
		<FormProvider {...form}>
			<Form className='flex flex-col justify-center' onSubmit={form.handleSubmit((data) => setParams(data))}>
				<Div
					className={cn({
						'flex items-center gap-x-2': !hasSearch,
						'grid grid-cols-[1fr_1fr_auto_auto] gap-x-2': hasSearch
					})}>
					<OrderSearchFieldControl />
					{hasSearch && (
						<SelectFieldControl
							name='type'
							datalist={[
								{ label: t('ns_inoutbound:action_types.warehouse_input'), value: RFIDDataType.INBOUND },
								{ label: t('ns_inoutbound:action_types.warehouse_output'), value: RFIDDataType.OUTBOUND }
							]}
							onValueChange={() => {
								form.setValue('order', '')
							}}
							className='h-10 flex-1'
							labelField='label'
							valueField='value'
						/>
					)}
					<Button size='lg'>
						<Icon name='Search' />
						{t('ns_common:actions.search')}
					</Button>
					{hasSearch && (
						<Button size='lg' variant='secondary' type='button' onClick={() => refetch()}>
							<Icon name='RefreshCcw' />
							{t('ns_common:actions.reload')}
						</Button>
					)}
				</Div>
				{!hasSearch && <WarehouseDataTypeFieldControl />}
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`max-w-4xl mx-auto w-full grid gap-y-10`

export default SearchForm
