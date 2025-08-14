import { cn } from '@/common/utils/cn'
import { Button, Div, Icon, Separator, Tooltip } from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { useUpdate } from 'ahooks'
import { useEditorContext } from '../../context/editor-context'
import { AlignmentDropdownMenu } from './toolbar-alignment-dropdown'
import ColorPicker from './toolbar-color-picker'
import FontSizeInput from './toolbar-font-size-input'
import { ImagePlaceholderToolbar } from './toolbar-image-placeholder'
import { LinkPopover } from './toolbar-link-popover'
import { SearchAndReplaceToolbar } from './toolbar-search-replace'
import { StyleDropdownMenu } from './toolbar-style-dropdown'
import TableDropdownMenu from './toolbar-table-dropdown'

const Toolbar: React.FC = () => {
	const { editor, event$ } = useEditorContext()

	if (!editor) return null

	const rerender = useUpdate()

	event$.useSubscription((value: string) => {
		if (value === 'editor:click') rerender()
	})

	return (
		<Div className='p-1'>
			<ScrollShadow className='overflow-x-auto scrollbar-none' orientation='horizontal'>
				<Div className='flex h-full items-center justify-start gap-x-1 p-1'>
					{/* Undo */}
					<Tooltip message='Hoàn tác'>
						<Button
							className='aspect-square h-8 w-8'
							type='button'
							size='icon'
							variant='ghost'
							onClick={() => editor.chain().focus().undo().run()}>
							<Icon name='Undo' />
						</Button>
					</Tooltip>

					{/* Redo */}
					<Tooltip message='Làm lại'>
						<Button
							className='aspect-square h-8 w-8'
							type='button'
							size='icon'
							variant='ghost'
							onClick={() => editor.chain().focus().redo().run()}>
							<Icon name='Redo' />
						</Button>
					</Tooltip>

					<Separator orientation='vertical' className='mx-3 h-6 w-px' />

					{/* Change style */}
					<StyleDropdownMenu editor={editor} />

					{/* Change font size */}
					<Tooltip message='Cỡ chữ'>
						<FontSizeInput />
					</Tooltip>

					<Separator orientation='vertical' className='mx-3 h-6 w-px' />

					<AlignmentDropdownMenu />

					{/* Toggle bold */}
					<Tooltip message='Đậm'>
						<Button
							variant='ghost'
							size='icon'
							className={cn(
								'aspect-square h-8 w-8',
								editor.isActive('bold') && 'bg-accent text-accent-foreground'
							)}
							onClick={() => editor.chain().focus().toggleBold().run()}>
							<Icon name='Bold' />
						</Button>
					</Tooltip>

					{/* Toggle italic */}
					<Tooltip message='Nghiêng'>
						<Button
							variant='ghost'
							size='icon'
							className={cn('aspect-square h-8 w-8', {
								'bg-accent text-accent-foreground': editor.isActive('italic')
							})}
							onClick={() => editor.chain().focus().toggleItalic().run()}>
							<Icon name='Italic' />
						</Button>
					</Tooltip>

					{/* Toggle quote */}
					<Tooltip message='Block quote'>
						<Button
							variant='ghost'
							size='icon'
							className={cn('aspect-square h-8 w-8', {
								'bg-accent text-accent-foreground': editor.isActive('blockquote')
							})}
							onClick={() => editor.chain().focus().toggleBlockquote().run()}>
							<Icon name='Quote' size={14} />
						</Button>
					</Tooltip>

					{/* Toggle underline */}
					<Tooltip message='Gạch chân'>
						<Button
							variant='ghost'
							size='icon'
							className={cn('aspect-square h-8 w-8', {
								'bg-accent text-accent-foreground': editor.isActive('underline')
							})}
							onClick={() => editor.commands.toggleUnderline()}>
							<Icon name='Underline' />
						</Button>
					</Tooltip>

					{/* Toggle underline */}
					<Tooltip message='Code'>
						<Button
							variant='ghost'
							size='icon'
							className={cn('aspect-square h-8 w-8', {
								'bg-accent text-accent-foreground': editor.isActive('underline')
							})}
							onClick={() => editor.commands.toggleCodeBlock()}>
							<Icon name='Code' />
						</Button>
					</Tooltip>

					{/* Toggle strike linethough */}
					<Tooltip message='Gạch ngang'>
						<Button
							variant='ghost'
							size='icon'
							className={cn('aspect-square h-8 w-8', {
								'bg-accent text-accent-foreground': editor.isActive('strike')
							})}
							onClick={() => editor.chain().focus().toggleStrike().run()}>
							<Icon name='Strikethrough' className='h-4 w-4' />
						</Button>
					</Tooltip>

					<Separator orientation='vertical' className='mx-3 h-6 w-px' />

					<ColorPicker label='Màu văn bản' icon='Baseline' editor={editor} type='textStyle' />
					<ColorPicker label='Highlight' icon='Highlighter' editor={editor} type='highlight' />

					<Separator orientation='vertical' className='mx-3 h-6 w-px' />

					{/* Toggle ordered list */}
					<Tooltip message='Danh sách được đánh số'>
						<Button
							variant='ghost'
							size='icon'
							className={cn('aspect-square h-8 w-8', {
								'bg-accent text-accent-foreground': editor.isActive('orderedList')
							})}
							onClick={() => editor.chain().focus().toggleOrderedList().run()}>
							<Icon name='ListOrdered' />
						</Button>
					</Tooltip>

					{/* Toggle bullet list */}
					<Tooltip message='Danh sách có dấu đầu dòng'>
						<Button
							variant='ghost'
							size='icon'
							className={cn('aspect-square h-8 w-8', {
								'bg-accent text-accent-foreground': editor.isActive('bulletList')
							})}
							onClick={() => editor.chain().focus().toggleBulletList().run()}>
							<Icon name='List' />
						</Button>
					</Tooltip>

					{/* Horizontal ruler */}
					<Tooltip message='Đường kẻ ngang'>
						<Button
							variant='ghost'
							size='icon'
							className='aspect-square h-8 w-8'
							onClick={() => editor.commands.setHorizontalRule()}>
							<Icon name='PencilLine' />
						</Button>
					</Tooltip>

					<LinkPopover editor={editor} />
					<ImagePlaceholderToolbar />
					<TableDropdownMenu editor={editor} />
					<Separator orientation='vertical' className='mx-3 h-6 w-px' />
					<Div className='ml-auto'>
						<SearchAndReplaceToolbar />
					</Div>
				</Div>
			</ScrollShadow>
		</Div>
	)
}

export default Toolbar
