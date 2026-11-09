'use no memo'

import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import { ScrollArea } from '@components/ui/scroll-area'
import { EditorContent, useEditor, type Editor as TiptapEditor } from '@tiptap/react'
import type { SingleCommands } from '@tiptap/core'
import { useDeepCompareEffect } from 'ahooks'
import { uniqueId } from 'lodash-es'
import React, { useCallback, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '../../ui/context-menu'
import BubbleMenu from './components/bubble-menu'
import CommonContextMenuItems from './components/context-menu/common-context-menu-items'
import LinkContextMenuItems from './components/context-menu/link-context-menu-items'
import TableContextMenuItems from './components/context-menu/table-context-menu-items'
import Toolbar from './components/toolbar'
import { EditorContextProvider } from './context/editor-context'
import { editorExtensions } from './extensions'
import { extractClipboardImages } from './utils/clipboard-images'
import { uploadImage } from './utils/image-upload'

export interface EditorHandle {
	getHTML: () => string
	isEmpty: () => boolean
	isUploading: () => boolean
	clearContent: () => void
	commands: () => SingleCommands | undefined
}

export interface EditorProps {
	onUpdate?: (state: { value: string; isEmpty: boolean }) => void
	onUploadStateChange?: (uploading: boolean) => void
	id?: string
	ref?: React.Ref<EditorHandle>
	className?: string
	name?: string
	defaultValue?: string
	disabled?: boolean
	height?: number
}

/**
 * @author quanghiep03198
 * @description A rich text editor component using Tiptap with a customizable toolbar, context menus, and support for various content types.
 *
 * Props:
 * - `onUpdate`: Callback function triggered on content update, providing the current HTML value and empty state.
 * - `id`: Optional ID for the editor element.
 * - `ref`: Optional ref for accessing the editor instance.
 * - `name`: Optional name attribute for the editor element.
 * - `defaultValue`: Initial HTML content for the editor.
 * - `disabled`: Boolean to disable editing.
 * - `height`: Height of the editor area in pixels (default is 350).
 * Returns:
 * - A React functional component rendering a rich text editor with toolbar and context menus.
 */

const Editor: React.FC<EditorProps> = ({
	className = '',
	defaultValue = '',
	disabled,
	height = 350,
	id = uniqueId(),
	ref,
	name,
	onUpdate,
	onUploadStateChange
}) => {
	const { i18n, t } = useTranslation()
	const [contextMenuType, setContextMenuType] = useState<keyof HTMLElementTagNameMap | null>(null)
	const uploadCount = useRef(0)
	const uploadStateCallback = useRef(onUploadStateChange)
	uploadStateCallback.current = onUploadStateChange
	const trackedUpload = useCallback(async (file: File) => {
		uploadCount.current += 1
		uploadStateCallback.current?.(true)
		try {
			return await uploadImage(file)
		} catch (error) {
			console.error('Image upload failed', error)
			toast.error(t('ns_common:editor.image_upload_failed'))
			throw error
		} finally {
			uploadCount.current -= 1
			uploadStateCallback.current?.(uploadCount.current > 0)
		}
	}, [t])

	const insertFiles = (currentEditor: TiptapEditor, files: File[], position: number) => {
		files.forEach((file, index) => {
			const uploadId = `${Date.now()}-${index}-${Math.random()}`
			const inserted = currentEditor.chain().insertContentAt(position, { type: 'image-placeholder', attrs: { uploadId } }).setMeta('addToHistory', false).run()
			if (!inserted) {
				toast.error(t('ns_common:editor.image_upload_failed'))
				return
			}
			const findPlaceholder = () => {
				let found: { pos: number; size: number } | undefined
				currentEditor.state.doc.descendants((node, pos) => {
					if (node.type.name === 'image-placeholder' && node.attrs.uploadId === uploadId) {
						found = { pos, size: node.nodeSize }
						return false
					}
				})
				return found
			}
			void trackedUpload(file).then((src) => {
				if (currentEditor.isDestroyed) return
				const placeholder = findPlaceholder()
				if (!placeholder) return
				currentEditor.view.dispatch(currentEditor.state.tr.delete(placeholder.pos, placeholder.pos + placeholder.size).setMeta('addToHistory', false))
				currentEditor.commands.insertContentAt(placeholder.pos, { type: 'figure', attrs: { src, alt: file.name } })
			}).catch(() => {
				if (currentEditor.isDestroyed) return
				const placeholder = findPlaceholder()
				if (placeholder) currentEditor.view.dispatch(currentEditor.state.tr.delete(placeholder.pos, placeholder.pos + placeholder.size).setMeta('addToHistory', false))
			})
		})
	}

	const editor = useEditor(
		{
			content: defaultValue,
			extensions: editorExtensions,
			editorProps: {
				handlePaste: (view, event) => {
					const files = Array.from(event.clipboardData?.files ?? [])
					if (files.length) {
						insertFiles(viewEditor(), files, view.state.selection.from)
						return true
					}
					const html = event.clipboardData?.getData('text/html')
					if (!html) return false
					let embeddedImages: ReturnType<typeof extractClipboardImages>
					try {
						embeddedImages = extractClipboardImages(html)
					} catch (error) {
						console.error('Invalid pasted image data', error)
						toast.error(t('ns_common:editor.image_upload_failed'))
						return true
					}
					if (!embeddedImages) return false
					const currentEditor = viewEditor()
					if (embeddedImages.html.trim()) currentEditor.commands.insertContent(embeddedImages.html)
					insertFiles(currentEditor, embeddedImages.files, currentEditor.state.selection.from)
					return true
				},
				handleDrop: (view, event) => {
					const files = Array.from(event.dataTransfer?.files ?? [])
					if (!files.length) return false
					const position = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos ?? view.state.selection.from
					insertFiles(viewEditor(), files, position)
					return true
				},
				attributes: {
					class: cn(
						'p-4 rounded-lg max-w-full max-h-full overflow-auto scrollbar-none border-none outline-none focus:outline-none focus:border-none min-h-[50vh] text-foreground bg-background',
						'prose prose-li:p-0 prose-p:text-sm prose-strong:text-inherit'
					)
				}
			},
			enableCoreExtensions: true,
			editable: !disabled,
			immediatelyRender: true,
			onUpdate: ({ editor }) => onUpdate?.({ value: editor.getHTML(), isEmpty: editor.isEmpty })
		},
		[disabled, i18n.language]
	)
	function viewEditor() {
		if (!editor) throw new Error('Editor is not ready')
		return editor
	}

	useDeepCompareEffect(() => {
		if (!editor || editor.isDestroyed || !defaultValue) return
		if (editor.getHTML() === defaultValue) return
		editor.commands.setContent(defaultValue)
	}, [defaultValue]) // editor không cần trong dep vì stable ref

	useImperativeHandle(
		ref,
		() => ({
			getHTML: () => editor?.getHTML() ?? '',
			isEmpty: () => editor?.isEmpty ?? true,
			isUploading: () => uploadCount.current > 0,
			clearContent: () => editor?.commands?.clearContent?.(),
			commands: () => editor?.commands
		}),
		[editor]
	)

	const handleContextMenuOpen: React.MouseEventHandler<HTMLSpanElement> = (e) => {
		const target = e.target as typeof e.currentTarget
		switch (true) {
			case Boolean(target.closest('table')):
				setContextMenuType('table')
				break
			case Boolean(target.closest('a')):
				setContextMenuType('a')
				break
			case Boolean(target.closest('img')):
				setContextMenuType('img')
				break

			default:
				setContextMenuType(null)
		}
	}

	if (!editor) return null

	return (
		<Div
			aria-roledescription='editor'
			className={cn(
				'divide-border relative flex w-full max-w-full flex-col items-stretch divide-y overflow-clip rounded-lg border shadow-sm',
				disabled && 'cursor-not-allowed opacity-50 [&>nav]:pointer-events-none',
				className
			)}>
			<EditorContextProvider
				editor={editor}
				insertImages={(files) => insertFiles(editor, files, editor.state.selection.from)}
				uploadImage={trackedUpload}>
				<Toolbar />
				<ContextMenu>
					<ContextMenuTrigger onContextMenu={handleContextMenuOpen}>
						<ScrollArea className='relative w-full max-w-full resize-y overflow-auto' style={{ height }}>
							<EditorContent
								content={defaultValue}
								controls={true}
								disabled={disabled}
								editor={editor}
								id={id}
								name={name}
							/>
						</ScrollArea>
					</ContextMenuTrigger>
					<ContextMenuContent className='min-w-80'>
						<CommonContextMenuItems editor={editor} />
						{contextMenuType === 'table' && <TableContextMenuItems editor={editor} />}
						{contextMenuType === 'a' && <LinkContextMenuItems editor={editor} />}
					</ContextMenuContent>
				</ContextMenu>
			</EditorContextProvider>
			<BubbleMenu editor={editor} />
		</Div>
	)
}

Editor.displayName = 'Editor'

export default Editor
