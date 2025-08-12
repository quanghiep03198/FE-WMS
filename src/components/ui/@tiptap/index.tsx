import { EditorContent, useEditor } from '@tiptap/react'
import { uniqueId } from 'lodash'
import React, { memo, useState } from 'react'
import { ContextMenu, ContextMenuContent, ContextMenuTrigger, Div, ScrollArea } from '..'
import BubbleMenu from './components/bubble-menu'
import CommonContextMenuItems from './components/context-menu/common-context-menu-items'
import ImageContextMenuItem from './components/context-menu/image-context-menu-item'
import LinkContextMenuItems from './components/context-menu/link-context-menu-items'
import TableContextMenuItems from './components/context-menu/table-context-menu-items'
import SetImageForm from './components/image-form'
import Toolbar from './components/toolbar'
import { EditorContextProvider } from './context/editor-context'
import { extensions } from './extensions'

export interface EditorProps {
	onUpdate: (state: { value: string; isEmpty: boolean }) => unknown
	id?: string
	name?: string
	content?: string
	disabled?: boolean
	height?: number
}

export const Editor: React.FC<EditorProps> = memo(
	({ content = '', id = uniqueId(), disabled, name, height = 350, onUpdate: handleUpdate }) => {
		const [contextMenuType, setContextMenuType] = useState<keyof HTMLElementTagNameMap | null>(null)

		const editor = useEditor(
			{
				content,
				extensions,
				editorProps: {
					attributes: {
						class: 'p-4 rounded-lg max-w-full max-h-full overflow-auto scrollbar-none border-none outline-none focus:outline-none focus:border-none min-h-[50vh] text-foreground bg-background prose prose-li:p-0'
					}
				},
				enableCoreExtensions: true,
				editable: !disabled,

				onUpdate: ({ editor }) => {
					if (handleUpdate) {
						handleUpdate({ value: editor.getHTML(), isEmpty: editor.isEmpty })
					}
				}
			},
			[content]
		)

		if (!editor) {
			return null
		}

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

		return (
			<Div className='relative flex w-full max-w-full flex-col items-stretch divide-y divide-border overflow-clip rounded-lg border shadow-sm'>
				<EditorContextProvider editor={editor}>
					<Toolbar editor={editor} />
					<ContextMenu>
						<ContextMenuTrigger onContextMenu={handleContextMenuOpen}>
							<ScrollArea className='relative w-full max-w-full resize-y overflow-auto' style={{ height }}>
								<EditorContent id={id} editor={editor} name={name} controls={true} content={content} />
							</ScrollArea>
						</ContextMenuTrigger>
						<ContextMenuContent className='min-w-[320px]'>
							<CommonContextMenuItems editor={editor} />
							{contextMenuType === 'table' && <TableContextMenuItems editor={editor} />}
							{contextMenuType === 'a' && <LinkContextMenuItems editor={editor} />}
							{contextMenuType === 'img' && <ImageContextMenuItem editor={editor} />}
						</ContextMenuContent>
					</ContextMenu>
					<SetImageForm editor={editor} />
				</EditorContextProvider>
				<BubbleMenu editor={editor} />
			</Div>
		)
	}
)

Editor.displayName = 'Editor'
