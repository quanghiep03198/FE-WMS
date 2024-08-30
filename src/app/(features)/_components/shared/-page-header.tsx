import { cn } from '@/common/utils/cn'
import { Typography, TypographyProps } from '@/components/ui'
import { forwardRef } from 'react'

type PageTitleProps = React.PropsWithChildren &
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export const PageHeader: React.FC<PageTitleProps> = forwardRef(({ children, className }, ref) => (
	<div
		ref={ref}
		className={cn('flex flex-col gap-y-1.5 text-left sm:items-center sm:text-center', className)}
		children={children}
	/>
))

export const PageTitle: React.FC<TypographyProps> = ({ children, className }) => (
	<Typography className={cn('text-lg font-semibold leading-none tracking-tight', className)} children={children} />
)

export const PageDescription: React.FC<TypographyProps> = ({ children, className }) => (
	<Typography variant='small' color='muted' className={className} children={children} />
)