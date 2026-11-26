import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { SelectFieldControl } from '@components/forms/select'
import { GhostButton } from '@components/shared/ghost-button'
import { Badge } from '@components/ui/badge'
import { Button } from '@components/ui/button'
import { Form as FormProvider } from '@components/ui/form'
import { Icon } from '@components/ui/icon'
import { StockFlow } from '@features/finished-goods/constants/enums'
import { useSearchOrderHistory } from '@features/report/hooks/use-search-order-history'
import useQueryParams from '@hooks/use-query-params'
import useScrollOnDrag from '@hooks/use-scroll-ondrag'
import { useUpdateEffect } from 'ahooks'
import { useMemo, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import {
	useGetInboundHistoryQuery,
	useGetOutboundHistoryQuery
} from '../../hooks/inoutbound-history/use-inoutbound-history-request'
import WarehouseDataTypeFieldControl from './data-type-field-control'
import { OrderSearchFieldControl } from './order-search-field-control'

const SearchForm: React.FC = () => {
	const { t } = useTranslation()
	const { searchParams, setParams } = useQueryParams<{ order?: string; type: StockFlow }>()
	const { refetch: refetchInboundHistory } = useGetInboundHistoryQuery()
	const { refetch: refetchOutboundHistory } = useGetOutboundHistoryQuery()
	const [recentlySearch, setRecentlySearch] = useSearchOrderHistory()

	const scrollRef = useRef<HTMLDivElement>(null)
	const { events } = useScrollOnDrag(scrollRef)

	// Handle scroll
	const scrollLeft = () => {
		if (scrollRef.current) {
			const scrollAmount = scrollRef.current.clientWidth
			scrollRef.current.scrollBy({
				left: -scrollAmount,
				behavior: 'smooth'
			})
		}
	}

	const scrollRight = () => {
		if (scrollRef.current) {
			const scrollAmount = scrollRef.current.clientWidth
			scrollRef.current.scrollBy({
				left: scrollAmount,
				behavior: 'smooth'
			})
		}
	}

	const form = useForm({
		defaultValues: {
			type: searchParams.type ?? StockFlow.INBOUND,
			order: searchParams.order ?? ''
		}
	})

	const currentType = useWatch({ control: form.control, name: 'type' })

	const hasSearch = searchParams.order && Object.values(StockFlow).includes(searchParams.type)

	const refetch = () => {
		if (searchParams.type === StockFlow.INBOUND) {
			refetchInboundHistory()
		} else if (searchParams.type === StockFlow.OUTBOUND) {
			refetchOutboundHistory()
		} else return
	}

	useUpdateEffect(() => {
		if (!hasSearch) form.setValue('order', '')
	}, [hasSearch])

	const recentSearchTerms: Array<string> = useMemo(() => {
		if (!currentType || (currentType !== StockFlow.INBOUND && currentType !== StockFlow.OUTBOUND)) return []
		return recentlySearch[currentType]
	}, [currentType, recentlySearch[currentType]])

	return (
		<FormProvider {...form}>
			<Form
				className='flex flex-col justify-center'
				onSubmit={form.handleSubmit((data) => {
					setParams(data)
					setRecentlySearch((prev) => {
						prev ??= { inbound: [], outbound: [] }
						if (!currentType) return prev
						return {
							...prev,
							[currentType]: [...new Set([data.order, ...prev[currentType]])].filter((item) => item).slice(0, 11)
						}
					})
				})}>
				<Div
					className={cn({
						'flex items-center gap-x-2': !hasSearch,
						'grid grid-cols-[1fr_1fr_auto_auto] gap-x-2': hasSearch
					})}>
					<OrderSearchFieldControl />
					{hasSearch && (
						<SelectFieldControl
							className='h-10 flex-1'
							labelField='label'
							name='type'
							valueField='value'
							datalist={[
								{ label: t('ns_inoutbound:action_types.stock_in'), value: StockFlow.INBOUND },
								{ label: t('ns_inoutbound:action_types.stock_out'), value: StockFlow.OUTBOUND }
							]}
							onValueChange={() => {
								form.setValue('order', '')
							}}
						/>
					)}
					<Button size='lg'>
						<Icon name='Search' />
						{t('ns_common:actions.search')}
					</Button>
					{hasSearch && (
						<Button size='lg' type='button' variant='secondary' onClick={() => refetch()}>
							<Icon name='RefreshCcw' />
							{t('ns_common:actions.reload')}
						</Button>
					)}
				</Div>
				<Div className='flex items-center justify-center gap-6 md:gap-3'>
					<Typography className='inline-flex items-center gap-x-2' color='muted' variant='small'>
						<Icon name='History' size={20} strokeWidth={1.5} />
						<span className='sm:hidden md:hidden'>
							{recentSearchTerms.length > 0
								? t('ns_common:titles.recently_search')
								: t('ns_common:titles.no_recently_search_yet')}
						</span>
					</Typography>
					{recentSearchTerms.length > 0 && (
						<Div className='flex items-center justify-center gap-x-2'>
							<GhostButton type='button' onClick={scrollLeft}>
								<Icon name='ChevronLeft' />
							</GhostButton>
							<Div
								{...events}
								className='scroll-fade-x overflow-x-auto xxl:max-w-lg flex max-w-sm snap-mandatory scrollbar-none items-center gap-x-2 px-1 md:max-w-xs'
								ref={scrollRef}>
								{recentSearchTerms.map((term) => (
									<Badge
										className='min-w-28 cursor-pointer justify-between overflow-hidden select-none'
										key={term}
										variant='outline'
										onClick={() => form.setValue('order', term)}>
										<span className='line-clamp-1 text-left text-ellipsis' title={term}>
											{term}
										</span>
										<GhostButton
											className='ml-auto'
											onClick={(e) => {
												e.stopPropagation()
												setRecentlySearch((prev) => {
													prev ??= { inbound: [], outbound: [] }
													if (!currentType) return prev
													return {
														...prev,
														[currentType]: prev[currentType].filter((item) => item !== term)
													}
												})
											}}>
											<Icon name='X' size={12} />
										</GhostButton>
									</Badge>
								))}
							</Div>
							<GhostButton type='button' onClick={scrollRight}>
								<Icon name='ChevronRight' />
							</GhostButton>
						</Div>
					)}
				</Div>
				{!hasSearch && <WarehouseDataTypeFieldControl />}
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`max-w-4xl mx-auto w-full grid gap-y-6`

export default SearchForm
