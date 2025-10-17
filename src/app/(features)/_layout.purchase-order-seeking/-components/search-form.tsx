import useQueryParams from '@/common/hooks/use-query-params'
import { Badge, Button, Div, Form as FormProvider, Icon, Typography } from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { useLocalStorageState } from 'ahooks'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { GhostButton } from '../../-components/-shared/ghost-button'
import { OrderSearchFieldControl } from './order-search-field-control'

const SearchForm: React.FC = () => {
	const { t } = useTranslation()
	const { searchParams, setParams } = useQueryParams<{ po?: string }>()

	const scrollRef = useRef<HTMLDivElement>(null)

	const form = useForm({
		defaultValues: {
			po: searchParams.po ?? ''
		}
	})

	const [recentlySearch, setRecentlySearch] = useLocalStorageState('recentPurchaseOrderSearchTerms', {
		listenStorageChange: true,
		defaultValue: []
	})

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
					<Button size='lg'>
						<Icon name='Search' />
						{t('ns_common:actions.search')}
					</Button>
				</Div>
				{recentlySearch.length > 0 && (
					<Div className='flex flex-col items-center justify-center gap-6'>
						<Typography variant='small' color='muted' className='inline-flex items-center gap-x-2'>
							<Icon name='History' size={20} strokeWidth={1.5} />
							Recently search
						</Typography>
						<Div className='flex items-center gap-x-2'>
							<GhostButton type='button' onClick={scrollLeft}>
								<Icon name='ChevronLeft' />
							</GhostButton>
							<ScrollShadow
								ref={scrollRef}
								orientation='horizontal'
								className='flex max-w-md snap-mandatory items-center gap-x-2 scroll-smooth px-2 scrollbar-none'>
								{recentlySearch.map((term) => (
									<Badge key={term} variant='outline'>
										{term}
									</Badge>
								))}
							</ScrollShadow>
							<GhostButton type='button' onClick={scrollRight}>
								<Icon name='ChevronRight' />
							</GhostButton>
						</Div>
					</Div>
				)}
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`max-w-4xl mx-auto w-full grid gap-y-10`

export default SearchForm
