'use no memo'

import { cn } from '@common/utils/cn'
import { Button, Div, Icon, Separator, Tooltip } from '@components/ui'
import { useEditorState } from '@tiptap/react'
import { useTranslation } from 'react-i18next'
import { useEditorContext } from '../../context/editor-context'
import { AlignmentDropdownMenu } from './toolbar-alignment-dropdown'
import ToolbarColorPicker from './toolbar-color-picker'
import FontSizeInput from './toolbar-font-size-input'
import ImageDropdown from './toolbar-image-dropdown'
import { LinkPopover } from './toolbar-link-popover'
import { SearchAndReplaceToolbar } from './toolbar-search-replace'
import { StyleDropdownMenu } from './toolbar-style-dropdown'
import TableDropdownMenu from './toolbar-table-dropdown'

const Toolbar: React.FC = () => {
	const { t } = useTranslation()
	const { editor } = useEditorContext()
	const editorState = useEditorState({
		editor,
		selector: ({ editor }) => ({
			isBold: editor.isActive('bold'),
			isItalic: editor.isActive('italic'),
			isBlockquote: editor.isActive('blockquote'),
			isUnderline: editor.isActive('underline'),
			isStrike: editor.isActive('strike'),
			isCodeBlock: editor.isActive('codeBlock'),
			isBulletList: editor.isActive('bulletList'),
			isOrderedList: editor.isActive('orderedList'),
			isTaskList: editor.isActive('taskList')
		})
	})

	return (
		<Div as='nav'>
			<Div className='flex h-full items-center gap-x-1 overflow-y-hidden p-1.5'>
				<SearchAndReplaceToolbar />

				<Separator className='mx-3 h-6 w-0.5 min-w-0.5 basis-0.5' orientation='vertical' />

				{/* Undo */}
				<Tooltip message={t('ns_common:actions.undo')}>
					<Button
						className='aspect-square size-8'
						size='icon'
						type='button'
						variant='ghost'
						onClick={() => editor.chain().focus().undo().run()}>
						<Icon name='Undo2' />
					</Button>
				</Tooltip>
				{/* Redo */}
				<Tooltip message={t('ns_common:actions.redo')}>
					<Button
						className='aspect-square size-8'
						size='icon'
						type='button'
						variant='ghost'
						onClick={() => editor.chain().focus().redo().run()}>
						<Icon name='Redo2' />
					</Button>
				</Tooltip>

				<Separator className='mx-3 h-6 w-0.5 min-w-0.5 basis-0.5' orientation='vertical' />

				{/* Change style */}
				<StyleDropdownMenu />

				{/* Change font size */}
				<Tooltip message={t('ns_common:editor.font_size')}>
					<FontSizeInput />
				</Tooltip>

				<Separator className='mx-3 h-6 w-0.5 min-w-0.5 basis-0.5' orientation='vertical' />

				<AlignmentDropdownMenu />

				{/* Toggle bold */}
				<Tooltip message={t('ns_common:editor.bold')}>
					<Button
						aria-pressed={editorState.isBold}
						className={cn('aria-pressed:bg-accent aria-pressed:text-accent-foreground aspect-square size-8')}
						size='icon'
						type='button'
						variant='ghost'
						onClick={() => editor.chain().focus().toggleBold().run()}>
						<Icon name='Bold' />
					</Button>
				</Tooltip>

				{/* Toggle italic */}
				<Tooltip message={t('ns_common:editor.italic')}>
					<Button
						size='icon'
						type='button'
						variant='ghost'
						className={cn('aspect-square size-8', {
							'bg-accent text-accent-foreground': editorState.isItalic
						})}
						onClick={() => editor.chain().focus().toggleItalic().run()}>
						<Icon name='Italic' />
					</Button>
				</Tooltip>

				{/* Toggle quote */}
				<Tooltip message={t('ns_common:editor.blockquote')}>
					<Button
						size='icon'
						type='button'
						variant='ghost'
						className={cn('aspect-square size-8', {
							'bg-accent text-accent-foreground': editorState.isBlockquote
						})}
						onClick={() => editor.chain().focus().toggleBlockquote().run()}>
						<Icon name='Quote' size={14} />
					</Button>
				</Tooltip>

				{/* Toggle underline */}
				<Tooltip message={t('ns_common:editor.underline')}>
					<Button
						size='icon'
						type='button'
						variant='ghost'
						className={cn('aspect-square size-8', {
							'bg-accent text-accent-foreground': editorState.isUnderline
						})}
						onClick={() => editor.commands.toggleUnderline()}>
						<Icon name='Underline' />
					</Button>
				</Tooltip>

				{/* Toggle code block */}
				<Tooltip message={t('ns_common:editor.code_block')}>
					<Button
						size='icon'
						type='button'
						variant='ghost'
						className={cn('aspect-square size-8', {
							'bg-accent text-accent-foreground': editorState.isCodeBlock
						})}
						onClick={() => editor.commands.toggleCodeBlock()}>
						<Icon name='Code' />
					</Button>
				</Tooltip>

				{/* Toggle strike linethough */}
				<Tooltip message={t('ns_common:editor.strikethrough')}>
					<Button
						size='icon'
						type='button'
						variant='ghost'
						className={cn('aspect-square size-8', {
							'bg-accent text-accent-foreground': editorState.isStrike
						})}
						onClick={() => editor.chain().focus().toggleStrike().run()}>
						<Icon className='h-4 w-4' name='Strikethrough' />
					</Button>
				</Tooltip>

				<Separator className='mx-3 h-6 w-0.5 min-w-0.5 basis-0.5' orientation='vertical' />

				{/* Text color and highlight */}
				<ToolbarColorPicker icon='Baseline' label={t('ns_common:editor.text_color')} type='textStyle' />
				<ToolbarColorPicker icon='Highlighter' label={t('ns_common:editor.highlight')} type='highlight' />

				<Separator className='mx-3 h-6 w-0.5 min-w-0.5 basis-0.5' orientation='vertical' />

				{/* Toggle ordered list */}
				<Tooltip message={t('ns_common:editor.ordered_list')}>
					<Button
						size='icon'
						type='button'
						variant='ghost'
						className={cn('aspect-square size-8', {
							'bg-accent text-accent-foreground': editorState.isOrderedList
						})}
						onClick={() => editor.chain().focus().toggleOrderedList().run()}>
						<Icon name='ListOrdered' size={20} />
					</Button>
				</Tooltip>

				{/* Toggle bullet list */}
				<Tooltip message={t('ns_common:editor.bullet_list')}>
					<Button
						size='icon'
						type='button'
						variant='ghost'
						className={cn('aspect-square size-8', {
							'bg-accent text-accent-foreground': editorState.isBulletList
						})}
						onClick={() => editor.chain().focus().toggleBulletList().run()}>
						<Icon name='List' size={18} />
					</Button>
				</Tooltip>
				{/* Toggle task list */}
				<Tooltip message={t('ns_common:editor.task_list')}>
					<Button
						size='icon'
						type='button'
						variant='ghost'
						className={cn('aspect-square size-8', {
							'bg-accent text-accent-foreground': editorState.isTaskList
						})}
						onClick={() => editor.chain().focus().toggleTaskList().run()}>
						<Icon name='ListTodo' size={18} />
					</Button>
				</Tooltip>

				{/* Horizontal ruler */}
				<Tooltip message={t('ns_common:editor.separator')}>
					<Button
						className='aspect-square size-8'
						size='icon'
						type='button'
						variant='ghost'
						onClick={() => editor.commands.setHorizontalRule()}>
						<Icon name='PencilLine' />
					</Button>
				</Tooltip>
				<LinkPopover />
				<ImageDropdown />
				<TableDropdownMenu />
			</Div>
		</Div>
	)
}

export default Toolbar
