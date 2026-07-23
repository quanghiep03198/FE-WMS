import { cn } from '@common/utils/cn'
import { Div, Typography } from '@components/ui'
import React from 'react'

const OSVisualCard: React.FC = () => {
	return (
		<Div className='group/visual-card hover:border-primary/50 @container/visual-card grid h-full auto-cols-auto auto-rows-min place-content-stretch rounded-lg border p-6 shadow-sm transition-colors duration-500 ease-in-out *:text-center sm:*:col-start-1 md:*:col-start-1 md:*:text-center @xl:gap-x-6 @xl/visual-card:*:text-left @2xl:gap-x-0 @7xl/visual:place-content-center'>
			<Typography className='mb-6 text-xl font-medium @xl/visual-card:col-start-2 @xl/visual-card:mt-10 @xl/visual-card:mb-4'>
				Available on
			</Typography>
			<img
				alt='Microsoft Windows'
				src='/windows.svg'
				className={cn(
					'mb-4 w-full max-w-36 place-self-center transition-all duration-300 ease-in-out',
					'group-hover/visual-card:-translate-x-2 group-hover/visual-card:-translate-y-1 group-hover/visual-card:drop-shadow-[16px_16px_4px_#00adef50]',
					'md:row-start-2 md:mb-4',
					'lg:translate-x-1/2 lg:group-hover/visual-card:translate-x-[calc(50%-8px)]',
					'@xl/visual-card:col-span-1 @xl/visual-card:col-start-1 @xl/visual-card:row-span-3 @xl/visual-card:row-start-1 @xl/visual-card:mb-0 @xl/visual-card:max-w-36',
					'@2xl/visual-card:w-[200%] @2xl/visual-card:max-w-40'
				)}
			/>
			<Typography
				variant='h2'
				className='mb-1 animate-[shimmer_3s_linear_infinite_both] bg-[linear-gradient(75deg,var(--foreground),45%,var(--muted-foreground),50%,var(--foreground))] bg-size-[200%_100%] bg-clip-text text-transparent md:text-4xl @md/visual-card:col-start-2 dark:bg-[linear-gradient(75deg,var(--muted-foreground),45%,var(--foreground),50%,var(--muted-foreground))]'>
				Microsoft Windows
			</Typography>
			<Typography className='@xl/visual-card:col-start-2 @xl/visual-card:mb-6'>
				Supported Windows 10 & Windows 11
			</Typography>
		</Div>
	)
}

export default OSVisualCard
