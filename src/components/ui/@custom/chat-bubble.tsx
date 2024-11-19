import { cn } from '@/common/utils/cn'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'

const chatBubbleVariant = cva('rounded-lg max-w-64 text-sm p-3', {
	variants: {
		variant: {
			primary: 'bg-primary text-primary-foreground',
			secondary: 'bg-secondary text-secondary-foreground'
		},
		side: {
			left: '[--_p:_100%] !rounded-br-[0_0]',
			right: '[--_p:_0] !rounded-bl-[0_0]'
		}
	}
})

export interface ChatBubbleProps
	extends React.PropsWithChildren,
		React.ComponentProps<'div'>,
		VariantProps<typeof chatBubbleVariant> {}

const ChatBubble: React.FC<ChatBubbleProps> = ({ children, variant, side, className }) => {
	return (
		<div
			className={cn(chatBubbleVariant({ variant, side, className }))}
			style={{
				...({
					'--_p': side === 'left' ? '100%' : '0' /* the position of the tail */,
					'--r': '0.5em' /* the radius */,
					'--t': '1.25em' /* the size of the tail */
				} as React.CSSProperties),
				borderRadius: 'calc(var(--r) + var(--t)) / var(--r)',
				borderInline: 'var(--t) solid transparent',
				mask: 'radial-gradient(100% 100% at var(--_p) 0, transparent 100%, black 105%) var(--_p) 100% / var(--t) var(--t) no-repeat, linear-gradient(black 0 0) padding-box'
			}}>
			{children}
		</div>
	)
}

export default ChatBubble
