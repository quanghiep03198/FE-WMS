import { Div, Typography } from '@/components/ui'
import React from 'react'

const OSVisualCard: React.FC = () => {
	return (
		<Div className='group/visual-card flex h-full flex-col items-center justify-center rounded-lg border p-6 transition-colors duration-500 ease-in-out hover:border-primary/50'>
			<Typography className='mb-6 text-xl font-medium'>Available on</Typography>
			<img
				src='/windows.svg'
				className='mb-4 w-full max-w-36 transition-all duration-500 ease-in-out group-hover/visual-card:-translate-x-2 group-hover/visual-card:-translate-y-1 group-hover/visual-card:drop-shadow-[16px_16px_4px_#00adef50]'
			/>
			<Typography
				variant='h2'
				className='mb-1 animate-[shimmer_3s_linear_infinite_both] bg-[linear-gradient(75deg,hsl(var(--foreground)),45%,hsl(var(--muted-foreground)),50%,hsl(var(--foreground)))] bg-[length:200%_100%] bg-clip-text text-transparent dark:bg-[linear-gradient(75deg,hsl(var(--muted-foreground)),45%,hsl(var(--foreground)),50%,hsl(var(--muted-foreground)))]'>
				Microsoft Windows
			</Typography>
			<Typography>Supported Windows 10 & Windows 11</Typography>
		</Div>
	)
}

export default OSVisualCard
