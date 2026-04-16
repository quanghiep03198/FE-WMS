import {
	type CommandProps,
	mergeAttributes,
	Node,
	type NodeViewProps,
	NodeViewWrapper,
	ReactNodeViewRenderer
} from '@tiptap/react'
import { useState } from 'react'
import { Icon } from '../../@core/icon'
import { Input } from '../../@core/input'
import { Div } from '../../@custom/div'
import { useImageUpload } from '../hooks/use-image-upload'
import { NODE_HANDLES_SELECTED_STYLE_CLASSNAME } from '../utils'

export interface ImagePlaceholderOptions {
	HTMLAttributes: Record<string, any>
	onUpload?: (url: string) => void
	onError?: (error: string) => void
}

export const ImagePlaceholder = Node.create<ImagePlaceholderOptions>({
	name: 'image-placeholder',

	addOptions() {
		return {
			HTMLAttributes: {},
			onUpload: () => {},
			onError: () => {}
		}
	},

	group: 'block',

	parseHTML() {
		return [{ tag: `div[data-type="${this.name}"]` }]
	},

	renderHTML({ HTMLAttributes }) {
		return ['div', mergeAttributes(HTMLAttributes)]
	},

	addNodeView() {
		return ReactNodeViewRenderer(ImagePlaceholderComponent, {
			className: NODE_HANDLES_SELECTED_STYLE_CLASSNAME
		})
	},
	addCommands() {
		return {
			insertImagePlaceholder: () => (props: CommandProps) => {
				return props.commands.insertContent({
					type: 'image-placeholder'
				})
			}
		}
	}
})

function ImagePlaceholderComponent(props: NodeViewProps) {
	const { editor } = props
	// const [isExpanded, setIsExpanded] = useState(false)
	// const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload')
	const [altText, setAltText] = useState('')
	// const [urlError, setUrlError] = useState(false)
	// const [isDragActive, setIsDragActive] = useState(false)
	// const { t } = useTranslation()

	const { previewUrl, fileInputRef, handleFileChange, handleRemove } = useImageUpload({
		onUpload: (imageUrl) => {
			editor
				.chain()
				.focus()
				.setImage({
					src: imageUrl,
					alt: altText || fileInputRef.current?.files?.[0]?.name
				})
				.run()
			handleRemove()
			// setIsExpanded(false)
		}
	})

	// const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
	// 	e.preventDefault()
	// 	e.stopPropagation()
	// 	setIsDragActive(true)
	// }

	// const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
	// 	e.preventDefault()
	// 	e.stopPropagation()
	// 	setIsDragActive(false)
	// }

	// const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
	// 	e.preventDefault()
	// 	e.stopPropagation()
	// }

	// const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
	// 	e.preventDefault()
	// 	e.stopPropagation()
	// 	setIsDragActive(false)

	// 	const file = e.dataTransfer.files[0]
	// 	if (file) {
	// 		const input = fileInputRef.current
	// 		if (input) {
	// 			const dataTransfer = new DataTransfer()
	// 			dataTransfer.items.add(file)
	// 			input.files = dataTransfer.files
	// 			handleFileChange({ target: input } as any)
	// 		}
	// 	}
	// }

	// const handleInsertEmbed = (e: FormEvent) => {
	// 	e.preventDefault()
	// 	const valid = isValidUrl(url)
	// 	if (!valid) {
	// 		setUrlError(true)
	// 		return
	// 	}
	// 	if (url) {
	// 		editor.chain().focus().setImage({ src: url, alt: altText }).run()
	// 		setIsExpanded(false)
	// 		setUrl('')
	// 		setAltText('')
	// 	}
	// }

	return (
		<NodeViewWrapper className='w-full'>
			{previewUrl && (
				<Div className='relative'>
					<img src={previewUrl} alt='Preview' className='mx-auto object-contain' />
					<Div className='absolute inset-0 place-content-center place-items-center bg-neutral-950/50'>
						<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' />
					</Div>
					<Input
						className='h-8 border-none text-center focus:border-none'
						onChange={(e) => setAltText(e.currentTarget.value)}
					/>
				</Div>
			)}
			<Input
				ref={fileInputRef}
				type='file'
				accept='image/*'
				onChange={handleFileChange}
				className='hidden'
				id='image-upload'
			/>
		</NodeViewWrapper>
	)
}
