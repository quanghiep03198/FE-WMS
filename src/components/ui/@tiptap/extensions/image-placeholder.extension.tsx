/* eslint-disable */
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
import { type FormEvent, Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
	const { t } = useTranslation()

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
			{!isExpanded ? (
				<Div
					onClick={() => setIsExpanded(true)}
					className={cn(
						'group relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 transition-all',
						selected && 'border-primary',
						isDragActive && 'border-primary',
						error && 'border-destructive bg-destructive/5'
					)}>
					<Div className='rounded-full bg-accent p-4 shadow-sm transition-colors'>
						<Image className='h-6 w-6' />
					</Div>
					<Div className='text-center'>
						<Typography className='text-sm font-medium'>{t('ns_common:editor.click_to_upload')}</Typography>
						<Typography variant='small' className='text-xs text-muted-foreground'>
							PNG, JPG, WEBP, JPEG
						</Typography>
					</Div>
				</Div>
			) : (
				<Div className='rounded-lg bg-accent/20 p-4 shadow-sm'>
					<Div className='mb-4 flex items-center justify-between'>
						<Typography variant='h4' className='m-0 inline-flex items-center gap-x-2 text-base'>
							<Icon name='ImagePlus' size={20} />
							{t('ns_common:editor.add_image')}
						</Typography>
						<Button variant='ghost' size='icon' onClick={() => setIsExpanded(false)}>
							<Icon name='X' />
						</Button>
					</Div>

					<Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className='w-full'>
						<TabsList className='grid w-full grid-cols-2'>
							<TabsTrigger value='upload'>
								<Upload className='mr-2 h-4 w-4' />
								{t('ns_common:actions.upload')}
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
													{t('ns_common:actions.cancel')}
												</Button>
												<Button disabled={uploading}>
													{uploading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
													{t('ns_common:actions.upload')}
												</Button>
											</Div>
										</Div>
									</Div>
								) : (
									<Fragment>
										<Input
											ref={fileInputRef}
											type='file'
											accept='image/*'
											onChange={handleFileChange}
											className='hidden'
											id='image-upload'
										/>
										<Label htmlFor='image-upload' className='flex cursor-pointer flex-col items-center gap-2'>
											<Icon name='Upload' size={32} className='mb-4 text-muted-foreground' />

											<Typography variant='small' as='p' className='m-0 text-sm font-medium'>
												{t('ns_common:editor.click_to_upload')}
											</Typography>
											<Typography variant='small' className='text-xs text-muted-foreground'>
												SVG, PNG, JPG or GIF
											</Typography>
										</Label>
									</Fragment>
								)}
								{error && <p className='mt-2 text-sm text-destructive'>{error}</p>}
							</Div>
						</TabsContent>

						<TabsContent
							value='url'
							className='rounded-lg border-2 border-dashed animate-in fade-in-50 slide-in-from-left-2'>
							<Div className='mx-auto w-full max-w-xl space-y-4 py-8'>
								<Div className='space-y-2'>
									<Input
										value={url}
										onChange={(e) => {
											setUrl(e.target.value)
											if (urlError) setUrlError(false)
										}}
										placeholder={t('ns_common:form_placeholder.fill', { object: 'URL', defaultValue: null })}
									/>
									{urlError && (
										<p className='text-xs text-destructive'>
											{t('ns_common:editor.validations.invalid_url')}
										</p>
									)}
								</Div>
								<Div className='space-y-2'>
									<Input
										value={altText}
										onChange={(e) => setAltText(e.target.value)}
										placeholder='Alt text (optional)'
									/>
								</Div>
								<Button onClick={handleInsertEmbed} className='w-full' disabled={!url}>
									<Icon name='ImagePlus' />
									{t('ns_common:editor.add_image')}
								</Button>
							</Div>
						</TabsContent>
					</Tabs>
				</Div>
			)}
		</NodeViewWrapper>
	)
}
