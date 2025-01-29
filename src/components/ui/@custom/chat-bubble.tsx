import { cn } from '@/common/utils/cn'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'

const chatBubbleVariant = cva('rounded-md max-w-64 text-sm p-3', {
	variants: {
		variant: {
			primary: 'bg-primary text-primary-foreground',
			secondary: 'bg-secondary text-secondary-foreground'
		}
	}
})

export interface ChatBubbleProps
	extends React.PropsWithChildren,
		React.ComponentProps<'div'>,
		VariantProps<typeof chatBubbleVariant> {}

const ChatBubble: React.FC<ChatBubbleProps> = ({ children, variant, className }) => {
	return <div className={cn(chatBubbleVariant({ variant, className }))}>{children}</div>
}

export default ChatBubble

// side: {
// 	left: '[--_p:_100%] !rounded-br-[0_0]',
// 	right: '[--_p:_0] !rounded-bl-[0_0]'
// }
// style={{
// 	...({
// 		'--_p': side === 'left' ? '100%' : '0%' /* the position of the tail */,
// 		'--r': '0.5em' /* the radius */,
// 		'--t': '1.75em' /* the size of the tail */
// 	} as React.CSSProperties),
// 	width: '20rem',
// 	borderRadius: 'calc(var(--r) + var(--t)) / var(--r)',
// 	borderInline: 'var(--t) solid transparent',
// 	mask: 'radial-gradient(98% 97% at var(--_p) 0, transparent 95%, black 100%) var(--_p) 103% / var(--t) var(--t) no-repeat, linear-gradient(black 0 0) padding-box'
// }}
