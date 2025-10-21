import { Badge, Div, Icon, Typography } from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import React, { useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSearchPoHistory } from '../-hooks/use-search-po-history'
import { GhostButton } from '../../-components/-shared/ghost-button'

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
		<Div className='flex items-center gap-6'>
			<Typography variant='small' color='muted' className='inline-flex items-center gap-x-2'>
				<Icon name='History' size={20} strokeWidth={1.5} />
				{recentlySearch.length > 0
					? t('ns_common:titles.recently_search')
					: t('ns_common:titles.no_recently_search_yet')}
			</Typography>
			{recentlySearch.length > 0 && (
				<Div className='flex items-center gap-x-2'>
					<GhostButton type='button' onClick={scrollLeft}>
						<Icon name='ChevronLeft' />
					</GhostButton>
					<ScrollShadow
						ref={scrollRef}
						orientation='horizontal'
						className='flex max-w-sm snap-mandatory items-center gap-x-2 scroll-smooth px-1 scrollbar-none xxl:max-w-lg'>
						{recentlySearch.map((term) => (
							<Badge
								key={term}
								variant='outline'
								className='min-w-28 cursor-pointer justify-between whitespace-nowrap'
								onClick={() => setValue('po', term)}>
								{term}{' '}
								<GhostButton
									className='ml-auto'
									onClick={() => setRecentlySearch(recentlySearch.filter((item) => item !== term))}>
									<Icon name='X' size={12} />
								</GhostButton>
							</Badge>
						))}
					</ScrollShadow>
					<GhostButton type='button' onClick={scrollRight}>
						<Icon name='ChevronRight' />
					</GhostButton>
				</Div>
			)}
		</Div>
	)
}

export default SearchHistory
