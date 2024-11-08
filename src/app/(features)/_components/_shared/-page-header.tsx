import { cn } from '@/common/utils/cn'
import { Typography, TypographyProps } from '@/components/ui'
import { forwardRef } from 'react'

type PageTitleProps = React.PropsWithChildren &
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export const PageHeader: React.FC<PageTitleProps> = forwardRef(({ children, className }, ref) => (
	<div ref={ref} className={cn('space-y-1 text-left sm:items-center sm:text-center', className)} children={children} />
))

export const PageTitle: React.FC<TypographyProps> = ({ children, className }) => (
	<Typography className={cn('text-2xl font-semibold leading-none tracking-tight', className)} children={children} />
)

export const PageDescription: React.FC<TypographyProps> = ({ children, className }) => (
	<Typography color='muted' className={className} children={children} />
)
