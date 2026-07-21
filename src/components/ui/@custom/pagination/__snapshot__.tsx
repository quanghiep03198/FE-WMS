/**
 * A snapshot version that is simplified Pagination component for Storybook
 * This version doesn't depend on Tanstack Router and can work independently
 */

import { Button, Div, Icon } from '@/components/ui'
import type { LucideProps } from 'lucide-react'
import { EllipsisIcon } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

interface StorybookPaginationProps {
	page: number
	totalPages: number
	hasNextPage?: boolean
	hasPrevPage?: boolean
	nextPage?: number
	prevPage?: number
	limit?: number
	totalDocs?: number
	range?: number
	onPageChange?: (page: number) => void
	onPrefetch?: (page: number) => void | Promise<void>
	maxContinuousPrefetch?: number
	continuousInterval?: number
}

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

/**
 * Pagination component for Storybook
 * This version is decoupled from Tanstack Router and works with simple props and callbacks
 * Supports smart prefetching of adjacent pages on hover
 */
const Pagination: React.FC<StorybookPaginationProps> = ({
	page: currentPage,
	totalPages,
	hasNextPage = currentPage < totalPages,
	hasPrevPage = currentPage > 1,
	nextPage = currentPage + 1,
	range,
	onPageChange,
	onPrefetch: handlePrefetch,
	maxContinuousPrefetch = 5,
	continuousInterval = 800
}) => {
	const paginationRange = calculatePaginationRange(currentPage, totalPages, range)
	const { t } = useTranslation()

	// Refs for managing prefetch state
	const prefetchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const continuousIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const prefetchedPagesRef = useRef<Set<number>>(new Set())
	const [continuousPrefetchState, setContinuousPrefetchState] = useState<{
		isActive: boolean
		currentOffset: number
		direction: 'next' | 'prev' | null
	}>({
		isActive: false,
		currentOffset: 1,
		direction: null
	})

	// Reset prefetch cache when currentPage changes
	useEffect(() => {
		prefetchedPagesRef.current.clear()
		setContinuousPrefetchState({
			isActive: false,
			currentOffset: 1,
			direction: null
		})
	}, [currentPage])

	const debouncedPrefetch = useCallback(
		async (page: number, delay: number = 150) => {
			if (!handlePrefetch || prefetchedPagesRef.current.has(page) || page < 1 || page > totalPages) return

			// Clear existing timeout
			if (prefetchTimeoutRef.current) {
				clearTimeout(prefetchTimeoutRef.current)
			}

			// Set new timeout
			prefetchTimeoutRef.current = setTimeout(async () => {
				try {
					await Promise.resolve(handlePrefetch(page))
					prefetchedPagesRef.current.add(page)
				} catch (error) {
					console.warn('Prefetch failed for page', page, error)
				}
			}, delay)
		},
		[handlePrefetch, totalPages]
	)

	// Continuous prefetch function - keeps prefetching while hovering
	const startContinuousPrefetch = useCallback(
		(direction: 'next' | 'prev', targetPage: number) => {
			if (!handlePrefetch) return

			// Stop any existing continuous prefetch
			if (continuousIntervalRef.current) {
				clearInterval(continuousIntervalRef.current)
			}

			setContinuousPrefetchState({
				isActive: true,
				currentOffset: 1,
				direction
			})

			// Start with immediate prefetch of target page
			debouncedPrefetch(targetPage, 50)

			// Set up continuous prefetching with progressive delay
			let currentOffset = 1
			let currentDelay = continuousInterval

			continuousIntervalRef.current = setInterval(() => {
				currentOffset += 1

				// Stop if we've reached the maximum or page bounds
				if (currentOffset > maxContinuousPrefetch) {
					clearInterval(continuousIntervalRef.current!)
					setContinuousPrefetchState((prev) => ({ ...prev, isActive: false }))
					return
				}

				const nextPageToPrefetch = direction === 'next' ? currentPage + currentOffset : currentPage - currentOffset

				// Check bounds
				if (nextPageToPrefetch < 1 || nextPageToPrefetch > totalPages) {
					clearInterval(continuousIntervalRef.current!)
					setContinuousPrefetchState((prev) => ({ ...prev, isActive: false }))
					return
				}

				// Prefetch the next page in sequence
				debouncedPrefetch(nextPageToPrefetch, 0) // No additional delay for continuous

				setContinuousPrefetchState((prev) => ({ ...prev, currentOffset }))

				// Progressively increase delay for later prefetches to reduce server load
				currentDelay = Math.min(currentDelay * 1.2, 2000)
			}, currentDelay)
		},
		[handlePrefetch, debouncedPrefetch, currentPage, totalPages, maxContinuousPrefetch, continuousInterval]
	)

	// Stop continuous prefetch
	const stopContinuousPrefetch = useCallback(() => {
		if (continuousIntervalRef.current) {
			clearInterval(continuousIntervalRef.current)
			continuousIntervalRef.current = null
		}
		setContinuousPrefetchState({
			isActive: false,
			currentOffset: 1,
			direction: null
		})
	}, [])

	// Smart prefetch for adjacent pages when hovering navigation buttons
	const handleNavButtonHover = useCallback(
		(targetPage: number, direction: 'next' | 'prev') => {
			if (!handlePrefetch) return

			// Start continuous prefetching
			startContinuousPrefetch(direction, targetPage)
		},
		[handlePrefetch, startContinuousPrefetch]
	)

	// Clear timeout and intervals on unmount
	useEffect(() => {
		return () => {
			if (prefetchTimeoutRef.current) {
				clearTimeout(prefetchTimeoutRef.current)
			}
			if (continuousIntervalRef.current) {
				clearInterval(continuousIntervalRef.current)
			}
		}
	}, [])

	return (
		<div className='flex flex-col items-center gap-3'>
			{/* Current Page Indicator */}
			<div className='flex items-center gap-4'>
				<div className='text-muted-foreground text-sm font-medium'>
					Page <span className='text-primary text-base font-bold'>{currentPage}</span> of {totalPages}
				</div>

				{/* Progress Bar */}
				<div className='flex items-center gap-2'>
					<div className='bg-muted h-1 w-24 overflow-hidden rounded-full'>
						<div
							className='bg-primary h-full transition-all duration-300 ease-out'
							style={{ width: `${(currentPage / totalPages) * 100}%` }}
						/>
					</div>
					<span className='text-muted-foreground min-w-[3ch] text-xs'>
						{Math.round((currentPage / totalPages) * 100)}%
					</span>
				</div>
			</div>

			<Div className='mx-auto flex w-full max-w-full items-center justify-center gap-x-0.5'>
				<Button
					disabled={!hasPrevPage}
					variant='ghost'
					size='sm'
					onClick={() => onPageChange?.(currentPage - 1)}
					onMouseEnter={() => hasPrevPage && handleNavButtonHover(currentPage - 1, 'prev')}
					onMouseLeave={stopContinuousPrefetch}
					className={
						continuousPrefetchState.isActive &&
						continuousPrefetchState.direction === 'prev' &&
						'animate-pulse delay-100'
					}>
					<Icon name='ChevronLeft' />
					{t('ns_common:pagination.previous_page')}
				</Button>
				<Button
					onClick={() => onPageChange?.(1)}
					onMouseEnter={() => debouncedPrefetch(1)}
					variant={currentPage === 1 ? 'outline' : 'ghost'}
					size='icon'>
					1
				</Button>
				{paginationRange[0] - 1 > 1 && <PaginationElipsis />}
				{paginationRange.map((pageIndex) => {
					const isCurrentPage = pageIndex === currentPage
					return (
						<Button
							key={pageIndex}
							onClick={() => onPageChange?.(pageIndex)}
							onMouseEnter={() => debouncedPrefetch(pageIndex)}
							variant={isCurrentPage ? 'outline' : 'ghost'}
							className='size-8 text-sm'
							size='icon'>
							{pageIndex}
						</Button>
					)
				})}
				{paginationRange.at(-1) + 1 < totalPages && <PaginationElipsis />}
				{totalPages > 1 && (
					<Button
						onClick={() => onPageChange?.(totalPages)}
						onMouseEnter={() => debouncedPrefetch(totalPages)}
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
					onClick={() => onPageChange?.(currentPage + 1)}
					onMouseEnter={() => hasNextPage && handleNavButtonHover(nextPage, 'next')}
					onMouseLeave={stopContinuousPrefetch}
					className={
						continuousPrefetchState.isActive &&
						continuousPrefetchState.direction === 'next' &&
						'animate-pulse delay-100'
					}>
					{t('ns_common:pagination.next_page')}
					<Icon name='ChevronRight' />
				</Button>
			</Div>
		</div>
	)
}

const PaginationElipsis = tw(EllipsisIcon)<
	Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
>`translate-y-1 size-3`

export default Pagination
