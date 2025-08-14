import { Color } from '@tiptap/extension-color'
import FileHandler from '@tiptap/extension-file-handler'
import Gapcursor from '@tiptap/extension-gapcursor'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { FontSize } from './font-size.extension'
import { ImagePlaceholder } from './image-placeholder.extension'
import { ImageExtension } from './image.extension'
import { SearchAndReplace } from './search-and-replace.extension'

export const extensions = [
	StarterKit.configure({
		heading: {
			levels: [1, 2, 3],
			HTMLAttributes: { class: 'font-bold text-foreground' }
		},
		bold: {
			HTMLAttributes: {
				class: 'font-bold text-foreground'
			}
		},
		paragraph: {
			HTMLAttributes: {
				class: 'my-1'
			}
		},
		blockquote: {
			HTMLAttributes: { class: 'text-foreground border-none' }
		},
		bulletList: {
			HTMLAttributes: {
				class: 'list-disc text-foreground'
			}
		},
		orderedList: {
			HTMLAttributes: {
				class: 'list-decimal text-foreground'
			}
		},
		listItem: {
			HTMLAttributes: {
				class: 'list-decimal text-foreground p-0'
			}
		},
		horizontalRule: {
			HTMLAttributes: {
				class: 'border-t dark:border-t-border'
			}
		}
	}),
	Placeholder.configure({
		placeholder: 'Bắt đầu nhập ...',
		emptyEditorClass:
			'text-muted-foreground font-normal text-sm before:pointer-event-none before:content-[attr(data-placeholder)]'
	}),
	Underline.configure(),
	TextAlign.configure({
		types: ['heading', 'paragraph']
	}),
	Gapcursor.configure(),
	Table.configure({
		resizable: true,
		lastColumnResizable: false,
		allowTableNodeSelection: true,
		HTMLAttributes: {
			class: 'm-0 w-full table-fixed overflow-hidden border rounded border-collapse [&.resize-cursor]:cursor-col-resize'
		}
	}),
	TableRow.configure(),
	TableHeader.configure({
		HTMLAttributes: {
			class: 'border p-3 relative [&.selectedCell]:bg-secondary/50 dark:[&.selectedCell]:bg-secondary/25'
		}
	}),
	TableCell.configure({
		HTMLAttributes: {
			class: 'p-3 border [&.selectedCell]:bg-secondary/50 dark:[&.selectedCell]:bg-secondary/25'
		}
	}),
	Highlight.configure({ multicolor: true }),
	Link.configure({
		openOnClick: false,
		autolink: false,
		HTMLAttributes: {
			class: 'text-blue-500 font-normal'
		}
	}),
	FontSize.configure(),
	TextStyle.configure(),
	Color.configure(),
	FileHandler.configure({
		allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
		onDrop: (currentEditor, files, pos) => {
			files.forEach((file) => {
				const fileReader = new FileReader()
				fileReader.readAsDataURL(file)
				fileReader.onload = () => {
					currentEditor
						.chain()
						.insertContentAt(pos, {
							type: 'image',
							attrs: {
								src: fileReader.result
							}
						})
						.focus()
						.run()
				}
			})
		},
		onPaste: (currentEditor, files, htmlContent) => {
			files.forEach((file) => {
				if (htmlContent) return false

				const fileReader = new FileReader()

				fileReader.readAsDataURL(file)
				fileReader.onload = () => {
					currentEditor
						.chain()
						.insertContentAt(currentEditor.state.selection.anchor, {
							type: 'image',
							attrs: {
								src: fileReader.result
							}
						})
						.focus()
						.run()
				}
			})
		}
	}),
	SearchAndReplace,
	ImagePlaceholder,
	ImageExtension
]
