import { cn } from '@/common/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, useRef } from 'react'

type TypographyProps = {
	as?: React.ElementType
} & React.HTMLAttributes<HTMLElement> &
	VariantProps<typeof typographyVariants> &
	React.PropsWithChildren

export const typographyVariants = cva('', {
	variants: {
		variant: {
			default: 'text-base tracking-tight',
			h1: 'text-6xl sm:text-5xl scroll-m-20 font-bold tracking-tight',
			h2: 'text-5xl sm:text-4xl font-bold scroll-m-20 tracking-tight',
			h3: 'text-4xl sm:text-3xl font-bold tracking-tight scroll-m-20',
			h4: 'text-3xl sm:text-2xl font-semibold tracking-tight scroll-m-20',
			h5: 'text-2xl sm:text-xl font-semibold tracking-tight scroll-m-20',
			h6: 'text-xl sm:text-lg font-semibold',
			p: 'leading-7',
			code: 'leading-7 font-mono',
			blockquote: 'mt-6 border-l-2 pl-6 italic',
			small: 'text-sm leading-snug'
		},
		color: {
			default: 'text-[inherit]',
			primary: 'text-primary',
			accent: 'accent',
			secondary: 'text-secondary',
			muted: 'text-muted-foreground',
			success: 'text-success',
			destructive: 'text-destructive'
		}
	},
	defaultVariants: {
		variant: 'default',
		color: 'default'
	}
})

export const Typography = forwardRef<HTMLElement, TypographyProps>((props, ref) => {
	const { as = 'p', className, children, color, variant, ...restProps } = props

	const localRef = useRef(null)
	const resolvedRef = ref ?? localRef

	const Element = !variant || variant === 'default' || as ? as : (variant as React.ElementType)

	return (
		<Element ref={resolvedRef} className={cn(typographyVariants({ variant, color, className }))} {...restProps}>
			{children}
		</Element>
	)
})
