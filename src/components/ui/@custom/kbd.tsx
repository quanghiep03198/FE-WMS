import { cn } from '@common/utils/cn'
import { type ComponentProps, Fragment, type ReactNode } from 'react'

const DefaultKbdSeparator = ({ className, children = '+', ...props }: ComponentProps<'span'>) => (
	<span className={cn('text-muted-foreground/50', className)} {...props}>
		{children}
	</span>
)
export type KbdProps = ComponentProps<'span'> & {
	separator?: ReactNode
}
export const Kbd = ({ className, separator = <DefaultKbdSeparator />, children, ...props }: KbdProps) => (
	<span
		className={cn(
			'inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 align-middle font-mono text-sm font-medium leading-loose text-muted-foreground',
			className
		)}
		{...props}>
		{Array.isArray(children)
			? children.map((child, index) => (
					<Fragment key={index.toString()}>
						{child}
						{index < children.length - 1 && separator}
					</Fragment>
				))
			: children}
	</span>
)
export type KbdKeyProps = ComponentProps<'kbd'>

export const KbdKey = (props: KbdKeyProps) => <kbd {...props} />
