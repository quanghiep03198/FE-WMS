import { Badge, Div, Icon, Typography } from '@components/ui'
import React, { useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { GhostButton } from '../../../../components/shared/ghost-button'
import { useSearchPoHistory } from '../../hooks/use-search-po-history'

const SearchHistory: React.FC = () => {
	const { setValue } = useFormContext()
	const [recentlySearch, setRecentlySearch] = useSearchPoHistory()
	const { t } = useTranslation()

	const scrollRef = useRef<HTMLDivElement>(null)

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
		<Div className='flex items-center gap-6 md:gap-3'>
			<Typography variant='small' color='muted' className='inline-flex items-center gap-x-2'>
				<Icon name='History' size={20} strokeWidth={1.5} />
				<span className='sm:hidden md:hidden'>
					{recentlySearch.length > 0
						? t('ns_common:titles.recently_search')
						: t('ns_common:titles.no_recently_search_yet')}
				</span>
			</Typography>
			{recentlySearch.length > 0 && (
				<Div className='flex items-center gap-x-2'>
					<GhostButton type='button' onClick={scrollLeft}>
						<Icon name='ChevronLeft' />
					</GhostButton>
					<div
						ref={scrollRef}

						className='scroll-fade-x xxl:max-w-lg flex max-w-sm snap-mandatory scrollbar-none items-center gap-x-2 scroll-smooth px-1 md:max-w-xs'>
						{recentlySearch.map((term) => (
							<Badge
								key={term}
								variant='outline'
								className='min-w-28 cursor-pointer justify-between overflow-hidden'
								onClick={() => setValue('po', term)}>
								<span className='line-clamp-1 text-left text-ellipsis' title={term}>
									{term}
								</span>
								<GhostButton
									className='ml-auto'
									onClick={() => setRecentlySearch(recentlySearch.filter((item) => item !== term))}>
									<Icon name='X' size={12} />
								</GhostButton>
							</Badge>
						))}
					</div>
					<GhostButton type='button' onClick={scrollRight}>
						<Icon name='ChevronRight' />
					</GhostButton>
				</Div>
			)}
		</Div>
	)
}

export default SearchHistory
