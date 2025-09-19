import useQueryParams from '@/common/hooks/use-query-params'
import { Button, Div, Icon } from '@/components/ui'
import { EllipsisIcon } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import tw from 'tailwind-styled-components'

type PaginationProps = Omit<Pagination<unknown>, 'data'> & { range?: number; onPrefetch?: (page: number) => void }

export const calculatePaginationRange = (
	currentPage: number,
	totalPages: number,
	range: number | undefined
): number[] => {
	range = range ?? 2
	let start = Math.max(1, currentPage - range)
	let end = Math.min(totalPages, currentPage + range)

	if (end - start < range * 2) {
		if (start === 1) {
			end = Math.min(totalPages, start + range * 2)
		} else {
			start = Math.max(1, end - range * 2)
		}
	}

	return Array.from({ length: end - start + 1 }, (_, i) => start + i).filter(
		(page) => page !== 1 && page !== totalPages
	)
}

const Pagination: React.FC<PaginationProps> = ({
	page: currentPage,
	totalPages,
	hasNextPage,
	hasPrevPage,
	nextPage,
	range,
	onPrefetch: handlePrefetch
}) => {
	const { setParams } = useQueryParams<{ page: number }>()
	const paginationRange = calculatePaginationRange(currentPage, totalPages, range)
	const { t } = useTranslation()

	return (
		<Div className='mx-auto flex w-full max-w-full items-center justify-center gap-x-0.5'>
			<Button disabled={!hasPrevPage} variant='ghost' size='sm' onClick={() => setParams({ page: currentPage - 1 })}>
				<Icon name='ChevronLeft' /> {t('ns_common:pagination.previous_page')}
			</Button>
			<Button
				onClick={() => setParams({ page: 1 })}
				onMouseEnter={() => {
					if (typeof handlePrefetch === 'function') handlePrefetch(1)
				}}
				variant={currentPage === 1 ? 'outline' : 'ghost'}
				className='size-8 text-sm'
				size='icon'>
				1
			</Button>
			{paginationRange[0] - 1 > 1 && <EllipsisIcon size={14} className='translate-y-1' />}
			{paginationRange.map((pageIndex) => {
				return (
					<Button
						key={pageIndex}
						onClick={() => setParams({ page: pageIndex })}
						onMouseEnter={() => {
							if (typeof handlePrefetch === 'function') handlePrefetch(pageIndex)
						}}
						variant={pageIndex === currentPage ? 'outline' : 'ghost'}
						className='size-8 text-sm'
						size='icon'>
						{pageIndex}
					</Button>
				)
			})}
			{paginationRange.at(-1) + 1 < totalPages && <EllipsisIcon size={14} className='translate-y-1' />}
			{totalPages > 1 && (
				<Button
					onClick={() => setParams({ page: totalPages })}
					onMouseEnter={() => {
						if (typeof handlePrefetch === 'function') handlePrefetch(totalPages)
					}}
					variant={currentPage === totalPages ? 'outline' : 'ghost'}
					className='size-8 text-sm'
					size='icon'>
					{totalPages}
				</Button>
			)}
			<Button
				variant='ghost'
				disabled={!hasNextPage}
				size='sm'
				onClick={() => setParams({ page: currentPage + 1 })}
				onMouseEnter={() => {
					if (typeof handlePrefetch === 'function') handlePrefetch(nextPage)
				}}>
				{t('ns_common:pagination.next_page')}
				<Icon name='ChevronRight' />
			</Button>
		</Div>
	)
}

const PaginationElipsis = tw.span`text-lg text-foreground`

export default Pagination
