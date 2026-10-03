import Image from '@tiptap/extension-image'
import { mergeAttributes, type NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { AlignCenter, AlignLeft, AlignRight, Edit, ImageIcon, Maximize, MoreVertical, Trash } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'

import { cn } from '@common/utils/cn'
import {
	Button,
	Div,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
	Icon,
	Input,
	Label,
	Separator,
	Typography
} from '@components/ui'
import { useTranslation } from 'react-i18next'
import { useImageUpload } from '../hooks/use-image-upload'

export const ImageExtension = Image.extend({
	allowGapCursor: true,
	name: 'figure',
	addAttributes() {
		return {
			src: {
				default: null
			},
			alt: {
				default: null
			},
			title: {
				default: null
			},
			width: {
				default: '100%'
			},
			height: {
				default: null
			},
			align: {
				default: 'center'
			},
			caption: {
				default: ''
			},
			aspectRatio: {
				default: null
			}
		}
	},
	parseHTML() {
		return [
			{
				tag: `figure[data-type="${this.name}"]`,
				getAttrs: (node) => {
					const figure = node as HTMLElement
					const img = figure.querySelector('img')
					const figcaption = figure.querySelector('figcaption')

					if (!img) return false

					return {
						src: img.getAttribute('src'),
						alt: img.getAttribute('alt'),
						title: img.getAttribute('title'),
						width: img.getAttribute('width'),
						height: img.getAttribute('height'),
						caption: figcaption?.textContent || ''
					}
				}
			}
		]
	},
	renderHTML({ HTMLAttributes }) {
		return [
			'figure',
			{ 'data-type': this.name },
			['img', mergeAttributes(HTMLAttributes)],
			['figcaption', { class: 'text-center text-muted-foreground' }, HTMLAttributes.caption || '']
		]
	},
	addNodeView: () => {
		return ReactNodeViewRenderer(TiptapImage)
	}
})

function TiptapImage(props: NodeViewProps) {
	const { node, editor, selected, deleteNode, updateAttributes } = props
	const imageRef = useRef<HTMLImageElement | null>(null)
	const nodeRef = useRef<HTMLDivElement | null>(null)
	const [resizing, setResizing] = useState(false)
	const [resizingPosition, setResizingPosition] = useState<'left' | 'right'>('left')
	const [resizeInitialWidth, setResizeInitialWidth] = useState(0)
	const [resizeInitialMouseX, setResizeInitialMouseX] = useState(0)
	const [editingCaption, setEditingCaption] = useState(false)
	const [caption, setCaption] = useState(node.attrs.caption || '')
	const [openedMore, setOpenedMore] = useState(false)
	const [imageUrl, setImageUrl] = useState('')
	const [altText, setAltText] = useState(node.attrs.alt || '')
	const { t } = useTranslation()

	const { fileInputRef, handleFileChange, handleRemove, isPending, error } = useImageUpload({
		onUpload: (imageUrl) => {
			updateAttributes({
				src: imageUrl,
				alt: altText || fileInputRef.current?.files?.[0]?.name
			})
			handleRemove()
			setOpenedMore(false)
		}
	})

	function handleResizingPosition({
		e,
		position
	}: {
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
		position: 'left' | 'right'
	}) {
		startResize(e)
		setResizingPosition(position)
	}

	function startResize(event: React.MouseEvent<HTMLDivElement>) {
		event.preventDefault()
		setResizing(true)
		setResizeInitialMouseX(event.clientX)
		if (imageRef.current) {
			setResizeInitialWidth(imageRef.current.offsetWidth)
		}
	}

	function resize(event: MouseEvent) {
		if (!resizing) return

		let dx = event.clientX - resizeInitialMouseX
		if (resizingPosition === 'left') {
			dx = resizeInitialMouseX - event.clientX
		}

		const newWidth = Math.max(resizeInitialWidth + dx, 150)
		const parentWidth = nodeRef.current?.parentElement?.offsetWidth ?? 0

		if (newWidth < parentWidth) {
			updateAttributes({
				width: newWidth
			})
		}
	}

	function endResize() {
		setResizing(false)
		setResizeInitialMouseX(0)
		setResizeInitialWidth(0)
	}

	function handleTouchStart(event: React.TouchEvent, position: 'left' | 'right') {
		event.preventDefault()
		setResizing(true)
		setResizingPosition(position)
		setResizeInitialMouseX(event.touches[0]?.clientX ?? 0)
		if (imageRef.current) {
			setResizeInitialWidth(imageRef.current.offsetWidth)
		}
	}

	function handleTouchMove(event: TouchEvent) {
		if (!resizing) return

		let dx = (event.touches[0]?.clientX ?? resizeInitialMouseX) - resizeInitialMouseX
		if (resizingPosition === 'left') {
			dx = resizeInitialMouseX - (event.touches[0]?.clientX ?? resizeInitialMouseX)
		}

		const newWidth = Math.max(resizeInitialWidth + dx, 150)
		const parentWidth = nodeRef.current?.parentElement?.offsetWidth ?? 0

		if (newWidth < parentWidth) {
			updateAttributes({
				width: newWidth
			})
		}
	}

	function handleTouchEnd() {
		setResizing(false)
		setResizeInitialMouseX(0)
		setResizeInitialWidth(0)
	}

	function handleCaptionChange(e: React.ChangeEvent<HTMLInputElement>) {
		const newCaption = e.target.value
		setCaption(newCaption)
	}

	function handleCaptionBlur() {
		updateAttributes({ caption })
		setEditingCaption(false)
	}

	function handleCaptionKeyDown(e: React.KeyboardEvent) {
		if (e.key === 'Enter') {
			handleCaptionBlur()
		}
	}

	const handleImageUrlSubmit = () => {
		if (imageUrl) {
			updateAttributes({
				src: imageUrl,
				alt: altText
			})
			setImageUrl('')
			setAltText('')
			setOpenedMore(false)
		}
	}

	useEffect(() => {
		window.addEventListener('mousemove', resize)
		window.addEventListener('mouseup', endResize)
		window.addEventListener('touchmove', handleTouchMove)
		window.addEventListener('touchend', handleTouchEnd)
		return () => {
			window.removeEventListener('mousemove', resize)
			window.removeEventListener('mouseup', endResize)
			window.removeEventListener('touchmove', handleTouchMove)
			window.removeEventListener('touchend', handleTouchEnd)
		}
	}, [resizing, resizeInitialMouseX, resizeInitialWidth])

	return (
		<NodeViewWrapper
			ref={nodeRef}
			style={{ width: node.attrs.width }}
			className={cn(
				'relative flex flex-col rounded border-2 border-transparent transition-all duration-200',
				selected ? 'border-active' : '',
				node.attrs.align === 'left' && 'left-0 translate-x-0',
				node.attrs.align === 'center' && 'left-1/2 -translate-x-1/2',
				node.attrs.align === 'right' && 'left-full -translate-x-full'
			)}>
			<Div className={cn('group relative rounded-md')}>
				<figure className={cn('relative m-0')}>
					<img
						alt={node.attrs.alt}
						className='rounded-[inherit] object-center'
						ref={imageRef}
						src={node.attrs.src}
						title={node.attrs.title}
						onLoad={(e) => {
							const img = e.currentTarget
							const aspectRatio = img.naturalWidth / img.naturalHeight
							updateAttributes({ aspectRatio })
						}}
					/>
					{editor?.isEditable && (
						<Fragment>
							<Div
								className={cn(
									'absolute top-0 left-0 z-20 cursor-nw-resize opacity-0 transition-opacity duration-200 group-hover:opacity-100',
									resizing && 'opacity-100'
								)}
								onTouchStart={(event) => handleTouchStart(event, 'left')}
								onMouseDown={(event) => {
									handleResizingPosition({ e: event, position: 'left' })
								}}>
								<Div className='bg-active ring-active/50 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-[3px]' />
							</Div>
							<Div
								className={cn(
									'absolute top-0 right-0 z-20 cursor-ne-resize opacity-0 transition-opacity duration-200 group-hover:opacity-100',
									resizing && 'opacity-100'
								)}
								onTouchStart={(event) => handleTouchStart(event, 'right')}
								onMouseDown={(event) => {
									handleResizingPosition({ e: event, position: 'right' })
								}}>
								<Div className='bg-active ring-active/50 size-2 translate-x-1/2 -translate-y-1/2 rounded-full ring-[3px]' />
							</Div>
							<Div
								className={cn(
									'absolute bottom-0 left-0 z-20 cursor-sw-resize opacity-0 transition-opacity duration-200 group-hover:opacity-100',
									resizing && 'opacity-100'
								)}
								onTouchStart={(event) => handleTouchStart(event, 'left')}
								onMouseDown={(event) => {
									handleResizingPosition({ e: event, position: 'left' })
								}}>
								<Div className='bg-active ring-active/50 size-2 -translate-x-1/2 translate-y-1/2 rounded-full ring-[3px]' />
							</Div>
							<Div
								className={cn(
									'absolute right-0 bottom-0 z-20 cursor-se-resize opacity-0 transition-opacity duration-200 group-hover:opacity-100',
									resizing && 'opacity-100'
								)}
								onTouchStart={(event) => handleTouchStart(event, 'right')}
								onMouseDown={(event) => {
									handleResizingPosition({ e: event, position: 'right' })
								}}>
								<Div className='bg-active ring-active/50 size-2 translate-x-1/2 translate-y-1/2 rounded-full ring-[3px]' />
							</Div>
						</Fragment>
					)}
				</figure>

				{editingCaption ? (
					<Input
						autoFocus
						className='text-muted-foreground h-9 rounded-none border-0 py-0 text-center text-sm shadow-none focus:border-0 focus:ring-offset-0'
						placeholder={t('ns_common:editor.add_caption')}
						value={caption}
						onBlur={handleCaptionBlur}
						onChange={handleCaptionChange}
						onKeyDown={handleCaptionKeyDown}
					/>
				) : (
					<Div
						className='text-muted-foreground h-9 cursor-text place-content-center place-items-center text-center text-sm'
						onClick={() => editor?.isEditable && setEditingCaption(true)}>
						{caption || 'Add a caption...'}
					</Div>
				)}

				{editor?.isEditable && (
					<Div
						className={cn(
							'bg-background/80 absolute top-2 right-2 flex items-center gap-1 rounded-md border p-1 opacity-0 backdrop-blur transition-opacity',
							!resizing && 'group-hover:opacity-100',
							openedMore && 'opacity-100'
						)}>
						<Button
							className={cn('size-7', node.attrs.align === 'left' && 'bg-accent')}
							size='icon'
							type='button'
							variant='ghost'
							onClick={() => updateAttributes({ align: 'left' })}>
							<AlignLeft className='size-4' />
						</Button>
						<Button
							className={cn('size-7', node.attrs.align === 'center' && 'bg-accent')}
							size='icon'
							type='button'
							variant='ghost'
							onClick={() => updateAttributes({ align: 'center' })}>
							<AlignCenter className='size-4' />
						</Button>
						<Button
							className={cn('size-7', node.attrs.align === 'right' && 'bg-accent')}
							size='icon'
							type='button'
							variant='ghost'
							onClick={() => updateAttributes({ align: 'right' })}>
							<AlignRight className='size-4' />
						</Button>
						<Separator className='h-[20px]' orientation='vertical' />
						<DropdownMenu open={openedMore} onOpenChange={setOpenedMore}>
							<DropdownMenuTrigger asChild>
								<Button className='size-7' size='icon' type='button' variant='ghost'>
									<MoreVertical className='size-4' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='start' alignOffset={-90} className='mt-1 min-w-48 text-sm'>
								<DropdownMenuItem onClick={() => setEditingCaption(true)}>
									<Edit className='mr-2 size-4' /> {t('ns_common:editor.edit_caption')}
								</DropdownMenuItem>
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>
										<ImageIcon className='mr-2 size-4' /> {t('ns_common:editor.replace_image')}
									</DropdownMenuSubTrigger>
									<DropdownMenuSubContent className='w-fit min-w-72 p-4'>
										<Div className='space-y-4'>
											<Div>
												<Input
													accept='image/*'
													className='hidden'
													id='replace-image-upload'
													ref={fileInputRef}
													type='file'
													onChange={handleFileChange}
												/>
												<label
													className='hover:bg-accent flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-4'
													htmlFor='replace-image-upload'>
													{isPending ? (
														<Icon className='h-4 w-4 animate-spin' name='LoaderCircle' />
													) : (
														<Fragment>
															<Icon name='Image' size={24} />
															<Typography variant='small'>
																{t('ns_common:editor.click_to_upload')}
															</Typography>
														</Fragment>
													)}
												</label>
												{error && <p className='text-destructive mt-2 text-xs'>{error}</p>}
											</Div>
											<Separator className='relative'>
												<Typography
													className='bg-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs uppercase'
													variant='small'>
													{t('ns_common:others.or')}
												</Typography>
											</Separator>
											<Div>
												<Div className='space-y-2'>
													<Input
														className='text-xs'
														value={imageUrl}
														placeholder={t('ns_common:form_placeholder.fill', {
															object: 'URL',
															defaultValue: null
														})}
														onChange={(e) => setImageUrl(e.target.value)}
													/>
													<Button
														className='w-full'
														disabled={!imageUrl}
														size='sm'
														type='button'
														onClick={handleImageUrlSubmit}>
														{t('ns_common:editor.replace_with_url')}
													</Button>
												</Div>
											</Div>

											<Div className='space-y-2'>
												<Label className='text-xs'>{t('ns_common:editor.alt_text')}</Label>
												<Input
													className='text-xs'
													placeholder='Alt text (optional)'
													value={altText}
													onChange={(e) => setAltText(e.target.value)}
												/>
											</Div>
										</Div>
									</DropdownMenuSubContent>
								</DropdownMenuSub>
								<DropdownMenuItem
									onClick={() => {
										const aspectRatio = node.attrs.aspectRatio
										if (aspectRatio) {
											const parentWidth = nodeRef.current?.parentElement?.offsetWidth ?? 0
											updateAttributes({
												width: parentWidth,
												height: parentWidth / aspectRatio
											})
										}
									}}>
									<Maximize className='mr-2 size-4' /> {t('ns_common:editor.full_width')}
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem className='text-destructive focus:text-destructive' onClick={deleteNode}>
									<Trash className='mr-2 size-4' /> {t('ns_common:editor.delete_image')}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</Div>
				)}
			</Div>
		</NodeViewWrapper>
	)
}
