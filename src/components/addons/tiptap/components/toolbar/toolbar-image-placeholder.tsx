import { cn } from '@common/utils/cn'
import '@components/addons/tiptap/index'
import { Tooltip } from '@components/customs/tooltip'
import { Button, type ButtonProps } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useEditorContext } from '../../context/editor-context'

const ImagePlaceholderToolbar: React.FC<ButtonProps> = ({ className, onClick, children, ...props }) => {
	const { editor } = useEditorContext()
	const { t } = useTranslation()

	return (
		<Tooltip message={t('ns_common:editor.image')} triggerProps={{ asChild: true }}>
			<Button
				className={cn('aspect-square size-8 p-0', editor?.isActive('image-placeholder') && 'bg-accent', className)}
				size='icon'
				type='button'
				variant='ghost'
				onClick={(e) => {
					e.preventDefault()
					editor?.chain().focus().insertImagePlaceholder().run()
					onClick?.(e)
				}}
				{...props}>
				{children ?? <Icon className='h-4 w-4' name='Image' />}
			</Button>
		</Tooltip>
	)
}

ImagePlaceholderToolbar.displayName = 'ImagePlaceholderToolbar'

export { ImagePlaceholderToolbar }
