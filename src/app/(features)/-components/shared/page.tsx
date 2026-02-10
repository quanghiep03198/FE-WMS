import { cn } from '@/common/utils/cn'
import { Separator, Typography, TypographyProps } from '@/components/ui'

type PageTitleProps = React.PropsWithChildren &
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export const PageHeader: React.FC<PageTitleProps> = ({ children, className, ref }) => (
	<div
		ref={ref}
		className={cn(
			'grid auto-cols-auto grid-flow-col gap-x-6 gap-y-1 text-left sm:items-center sm:text-center',
			className
		)}>
		{children}
	</div>
)

export const PageTitle: React.FC<TypographyProps> = ({ children, className }) => (
	<Typography className={cn('col-start-1 text-xl font-semibold tracking-tight', className)}>{children}</Typography>
)

export const PageDescription: React.FC<TypographyProps> = ({ children, className }) => (
	<Typography variant='small' color='muted' className={cn('col-start-1 row-start-2 text-pretty', className)}>
		{children}
	</Typography>
)

export const PageAction: React.FC<React.ComponentProps<'div'>> = ({ children, className, ...props }) => {
	return (
		<div {...props} className={cn('col-start-2 row-span-2 flex items-stretch justify-end gap-2', className)}>
			{children}
		</div>
	)
}

export const PageWrapper: React.FC<React.ComponentProps<'section'>> = ({ children, className, ...props }) => {
	return (
		<section {...props} className={cn('space-y-4', className)}>
			{children}
		</section>
	)
}

export const PageSeparator: React.FC<React.ComponentProps<typeof Separator>> = ({ className, ...props }) => (
	<Separator {...props} className={cn('hidden xxl:block', className)} />
)
