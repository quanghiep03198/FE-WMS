/* eslint-disable */
// @ts-nocheck
import { cn } from '@/common/utils/cn'
import { Button, Div, Icon, Input, Label, Tabs, TabsContent, TabsList, TabsTrigger, Typography } from '@/components/ui'
import {
	type CommandProps,
	mergeAttributes,
	Node,
	type NodeViewProps,
	NodeViewWrapper,
	ReactNodeViewRenderer
} from '@tiptap/react'
import { Image, Link, Loader2, Upload } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { useImageUpload } from '../hooks/use-image-upload'
import { isValidUrl, NODE_HANDLES_SELECTED_STYLE_CLASSNAME } from '../utils'

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
		return [{ tag: `Div[data-type="${this.name}"]` }]
	},

	renderHTML({ HTMLAttributes }) {
		return ['Div', mergeAttributes(HTMLAttributes)]
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
	const { editor, extension, selected } = props
	const [isExpanded, setIsExpanded] = useState(false)
	const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload')
	const [url, setUrl] = useState('')
	const [altText, setAltText] = useState('')
	const [urlError, setUrlError] = useState(false)
	const [isDragActive, setIsDragActive] = useState(false)

	const { previewUrl, fileInputRef, handleFileChange, handleRemove, uploading, error } = useImageUpload({
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
			setIsExpanded(false)
		}
	})

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragActive(true)
	}

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragActive(false)
	}

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragActive(false)

		const file = e.dataTransfer.files[0]
		if (file) {
			const input = fileInputRef.current
			if (input) {
				const dataTransfer = new DataTransfer()
				dataTransfer.items.add(file)
				input.files = dataTransfer.files
				handleFileChange({ target: input } as any)
			}
		}
	}

	const handleInsertEmbed = (e: FormEvent) => {
		e.preventDefault()
		const valid = isValidUrl(url)
		if (!valid) {
			setUrlError(true)
			return
		}
		if (url) {
			editor.chain().focus().setImage({ src: url, alt: altText }).run()
			setIsExpanded(false)
			setUrl('')
			setAltText('')
		}
	}

	return (
		<NodeViewWrapper className='w-full'>
			<Div className='relative'>
				{!isExpanded ? (
					<Div
						onClick={() => setIsExpanded(true)}
						className={cn(
							'group relative flex cursor-pointer flex-col items-center gap-4 rounded-lg border-2 border-dashed p-8 transition-all hover:bg-accent',
							selected && 'border-primary bg-primary/5',
							isDragActive && 'border-primary bg-primary/5',
							error && 'border-destructive bg-destructive/5'
						)}>
						<Div className='rounded-full bg-background p-4 shadow-sm transition-colors group-hover:bg-accent'>
							<Image className='h-6 w-6' />
						</Div>
						<Div className='text-center'>
							<Typography className='text-sm font-medium'>Click to upload or drag and drop</Typography>
							<Typography variant='small' className='text-xs text-muted-foreground'>
								SVG, PNG, JPG or GIF
							</Typography>
						</Div>
					</Div>
				) : (
					<Div className='rounded-lg border bg-card p-4 shadow-sm'>
						<Div className='mb-4 flex items-center justify-between'>
							<Typography variant='h4' className='m-0 text-base'>
								Add Image
							</Typography>
							<Button variant='ghost' size='icon' onClick={() => setIsExpanded(false)}>
								<Icon name='X' />
							</Button>
						</Div>

						<Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className='w-full'>
							<TabsList className='grid w-full grid-cols-2'>
								<TabsTrigger value='upload'>
									<Upload className='mr-2 h-4 w-4' />
									Upload
								</TabsTrigger>
								<TabsTrigger value='url'>
									<Link className='mr-2 h-4 w-4' />
									URL
								</TabsTrigger>
							</TabsList>

							<TabsContent value='upload' className='animate-in fade-in-50 slide-in-from-right-2'>
								<Div
									onDragEnter={handleDragEnter}
									onDragLeave={handleDragLeave}
									onDragOver={handleDragOver}
									onDrop={handleDrop}
									className={cn(
										'my-4 rounded-lg border-2 border-dashed p-8 text-center transition-colors',
										isDragActive && 'border-primary bg-primary/10',
										error && 'border-destructive bg-destructive/10'
									)}>
									{previewUrl ? (
										<Div className='space-y-4'>
											<img
												src={previewUrl}
												alt='Preview'
												className='mx-auto max-h-[200px] rounded-lg object-cover'
											/>
											<Div className='space-y-2'>
												<Input
													value={altText}
													onChange={(e) => setAltText(e.target.value)}
													placeholder='Alt text (optional)'
												/>
												<Div className='flex justify-end gap-2'>
													<Button variant='outline' onClick={handleRemove} disabled={uploading}>
														Remove
													</Button>
													<Button disabled={uploading}>
														{uploading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
														Upload
													</Button>
												</Div>
											</Div>
										</Div>
									) : (
										<>
											<Input
												ref={fileInputRef}
												type='file'
												accept='image/*'
												onChange={handleFileChange}
												className='hidden'
												id='image-upload'
											/>
											<Label
												htmlFor='image-upload'
												className='flex cursor-pointer flex-col items-center gap-2'>
												<Icon name='Upload' size={32} className='mb-4 text-muted-foreground' />

												<Typography variant='small' as='p' className='m-0 text-sm font-medium'>
													Click to upload or drag and drop
												</Typography>
												<Typography variant='small' className='text-xs text-muted-foreground'>
													SVG, PNG, JPG or GIF
												</Typography>
											</Label>
										</>
									)}
									{error && <p className='mt-2 text-sm text-destructive'>{error}</p>}
								</Div>
							</TabsContent>

							<TabsContent
								value='url'
								className='rounded-md border bg-background animate-in fade-in-50 slide-in-from-left-2'>
								<Div className='mx-auto w-full max-w-xl space-y-4 py-4'>
									<Div className='space-y-2'>
										<Input
											value={url}
											onChange={(e) => {
												setUrl(e.target.value)
												if (urlError) setUrlError(false)
											}}
											placeholder='Enter image URL...'
										/>
										{urlError && <p className='text-xs text-destructive'>Please enter a valid URL</p>}
									</Div>
									<Div className='space-y-2'>
										<Input
											value={altText}
											onChange={(e) => setAltText(e.target.value)}
											placeholder='Alt text (optional)'
										/>
									</Div>
									<Button onClick={handleInsertEmbed} className='w-full' disabled={!url}>
										Add Image
									</Button>
								</Div>
							</TabsContent>
						</Tabs>
					</Div>
				)}
			</Div>
		</NodeViewWrapper>
	)
}
