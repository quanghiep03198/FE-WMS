import { i18n } from '@/i18n'
import { Color } from '@tiptap/extension-color'
import Gapcursor from '@tiptap/extension-gapcursor'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import { ListKit } from '@tiptap/extension-list'
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
				class: 'font-bold'
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
		horizontalRule: {
			HTMLAttributes: {
				class: 'border-t dark:border-t-border'
			}
		}
	}),
	ListKit.configure({
		bulletList: {
			HTMLAttributes: {
				class: 'list-disc text-foreground'
			}
		},
		orderedList: {
			HTMLAttributes: {
				class: 'list-decimal text-foreground m-0'
			}
		},
		listItem: {
			HTMLAttributes: {
				class: 'text-foreground m-0'
			}
		},
		taskList: {
			itemTypeName: 'taskItem',
			HTMLAttributes: {
				class: 'list-none p-0'
			}
		},
		taskItem: {
			HTMLAttributes: {
				class: 'm-0 [&_p]:m-0 [&_label]:place-content-center [&_label]:place-items-center [&_p]:leading-relaxed [&_p]:align-middle flex items-baseline [&_label]:h-fit [&_input[type=checkbox]]:form-checkbox [&_input[type=checkbox]]:text-active [&_input[type=checkbox]]:mr-2 [&_input[type=checkbox]]:rounded [&_input[type=checkbox]]:!size-4'
			}
		}
	}),
	Placeholder.configure({
		placeholder: i18n.t('ns_common:editor.placeholder'),
		showOnlyWhenEditable: true,
		emptyEditorClass:
			'before:h-0 before:pl-1 before:place-self-center before:float-left text-muted-foreground font-normal text-sm before:pointer-event-none before:content-[attr(data-placeholder)] [&:not(p)]:before:hidden'
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
		cellMinWidth: 80,
		HTMLAttributes: {
			class: 'm-0 w-full table-fixed overflow-hidden border rounded border-collapse [&.resize-cursor]:cursor-col-resize'
		}
	}),
	TableRow.configure(),
	TableHeader.configure({
		HTMLAttributes: {
			class: 'border px-3 py-1 relative [&.selectedCell]:bg-secondary/50 dark:[&.selectedCell]:bg-secondary/25'
		}
	}),
	TableCell.configure({
		HTMLAttributes: {
			class: 'px-3 py-1 border [&.selectedCell]:bg-secondary/50 dark:[&.selectedCell]:bg-secondary/25 before:hidden align-top'
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
	SearchAndReplace.configure(),
	ImagePlaceholder.configure(),
	ImageExtension.configure({
		HTMLAttributes: {
			class: 'object-center max-w-full before:text-muted-foreground before:content-[attr(caption)]',
			loading: 'lazy'
		},
		allowBase64: true
	})
	// FileHandler.configure({
	// 	allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],

	// 	onDrop: (currentEditor, files, pos) => {
	// 		files.forEach((file) => {
	// 			currentEditor.chain().focus().insertImagePlaceholder().run()

	// 			const fileReader = new FileReader()
	// 			fileReader.readAsDataURL(file)
	// 			fileReader.onload = async() => {
	// 				currentEditor
	// 					.chain()
	// 					.insertContentAt(pos, {
	// 						type: 'image',
	// 						attrs: {
	// 							src: fileReader.result
	// 						}
	// 					})
	// 					.focus()
	// 					.run()
	// 			}
	// 		})
	// 	},
	// 	onPaste: (currentEditor, files, htmlContent) => {
	// 		files.forEach((file) => {
	// 			if (htmlContent) return false
	// 			const fileReader = new FileReader()
	// 			fileReader.readAsDataURL(file)
	// 			fileReader.onload = () => {
	// 				currentEditor
	// 					.chain()
	// 					.insertContentAt(currentEditor.state.selection.anchor, {
	// 						type: 'image',
	// 						attrs: {
	// 							src: fileReader.result
	// 						}
	// 					})
	// 					.focus()
	// 					.run()
	// 			}
	// 		})
	// 	}
	// }),
]
