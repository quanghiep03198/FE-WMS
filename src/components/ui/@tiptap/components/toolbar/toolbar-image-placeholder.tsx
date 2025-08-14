// @ts-nocheck

import { cn } from '@/common/utils/cn'
import { Button, Icon, Tooltip, type ButtonProps } from '@/components/ui'
import React from 'react'
import { useEditorContext } from '../../context/editor-context'

const ImagePlaceholderToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, onClick, children, ...props }, ref) => {
		const { editor } = useEditorContext()
		return (
			<Tooltip message='Image' triggerProps={{ asChild: true }}>
				<Button
					variant='ghost'
					size='icon'
					className={cn(
						'h-8 w-8 p-0 sm:h-9 sm:w-9',
						editor?.isActive('image-placeholder') && 'bg-accent',
						className
					)}
					onClick={(e) => {
						e.preventDefault()
						editor?.chain().focus().insertImagePlaceholder().run()
						onClick?.(e)
					}}
					ref={ref}
					{...props}>
					{children ?? <Icon name='Image' className='h-4 w-4' />}
				</Button>
			</Tooltip>
		)
	}
)

ImagePlaceholderToolbar.displayName = 'ImagePlaceholderToolbar'

export { ImagePlaceholderToolbar }
