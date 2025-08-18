/* eslint-disable */
import Image from '@tiptap/extension-image'
import { type NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { AlignCenter, AlignLeft, AlignRight, Edit, ImageIcon, Maximize, MoreVertical, Trash } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'

import { cn } from '@/common/utils/cn'
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
} from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { useImageUpload } from '../hooks/use-image-upload'

export const ImageExtension = Image.extend({
	allowGapCursor: true,
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

	const { previewUrl, fileInputRef, handleFileChange, handleRemove, isPending, error } = useImageUpload({
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
			className={cn(
				'relative flex flex-col rounded border-2 border-transparent transition-all duration-200',
				selected ? 'border-active' : '',
				node.attrs.align === 'left' && 'left-0 -translate-x-0',
				node.attrs.align === 'center' && 'left-1/2 -translate-x-1/2',
				node.attrs.align === 'right' && 'left-full -translate-x-full'
			)}
			style={{ width: node.attrs.width }}>
			<Div className={cn('group relative rounded-md', selected && 'divide-y-2 divide-active')}>
				<Div as='figure' className={cn('relative m-0')}>
					<img
						ref={imageRef}
						src={node.attrs.src}
						alt={node.attrs.alt}
						title={node.attrs.title}
						className='rounded-[inherit] object-center transition-shadow duration-200 hover:shadow-lg'
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
									'absolute left-0 top-0 z-20 cursor-nw-resize opacity-0 transition-opacity duration-200 group-hover:opacity-100',
									resizing && 'opacity-100'
								)}
								onMouseDown={(event) => {
									handleResizingPosition({ e: event, position: 'left' })
								}}
								onTouchStart={(event) => handleTouchStart(event, 'left')}>
								<Div className='size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-active ring-[3px] ring-active/50' />
							</Div>
							<Div
								className={cn(
									'absolute right-0 top-0 z-20 cursor-ne-resize opacity-0 transition-opacity duration-200 group-hover:opacity-100',
									resizing && 'opacity-100'
								)}
								onMouseDown={(event) => {
									handleResizingPosition({ e: event, position: 'right' })
								}}
								onTouchStart={(event) => handleTouchStart(event, 'right')}>
								<Div className='size-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-active ring-[3px] ring-active/50' />
							</Div>
							<Div
								className={cn(
									'absolute bottom-0 left-0 z-20 cursor-sw-resize opacity-0 transition-opacity duration-200 group-hover:opacity-100',
									resizing && 'opacity-100'
								)}
								onMouseDown={(event) => {
									handleResizingPosition({ e: event, position: 'left' })
								}}
								onTouchStart={(event) => handleTouchStart(event, 'left')}>
								<Div className='size-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-active ring-[3px] ring-active/50' />
							</Div>
							<Div
								className={cn(
									'absolute bottom-0 right-0 z-20 cursor-se-resize opacity-0 transition-opacity duration-200 group-hover:opacity-100',
									resizing && 'opacity-100'
								)}
								onMouseDown={(event) => {
									handleResizingPosition({ e: event, position: 'right' })
								}}
								onTouchStart={(event) => handleTouchStart(event, 'right')}>
								<Div className='size-2 translate-x-1/2 translate-y-1/2 rounded-full bg-active ring-[3px] ring-active/50' />
							</Div>
						</Fragment>
					)}
				</Div>

				{editingCaption ? (
					<Input
						value={caption}
						onChange={handleCaptionChange}
						onBlur={handleCaptionBlur}
						onKeyDown={handleCaptionKeyDown}
						className='h-9 rounded-none border-0 py-0 text-center text-sm text-muted-foreground shadow-none focus:border-0 focus:ring-offset-0'
						placeholder={t('ns_common:editor.add_caption')}
						autoFocus
					/>
				) : (
					<Div
						className='h-9 cursor-text place-content-center place-items-center text-center text-sm text-muted-foreground'
						onClick={() => editor?.isEditable && setEditingCaption(true)}>
						{caption || 'Add a caption...'}
					</Div>
				)}

				{editor?.isEditable && (
					<Div
						className={cn(
							'absolute right-2 top-2 flex items-center gap-1 rounded-md border bg-background/80 p-1 opacity-0 backdrop-blur transition-opacity',
							!resizing && 'group-hover:opacity-100',
							openedMore && 'opacity-100'
						)}>
						<Button
							size='icon'
							className={cn('size-7', node.attrs.align === 'left' && 'bg-accent')}
							variant='ghost'
							type='button'
							onClick={() => updateAttributes({ align: 'left' })}>
							<AlignLeft className='size-4' />
						</Button>
						<Button
							size='icon'
							className={cn('size-7', node.attrs.align === 'center' && 'bg-accent')}
							variant='ghost'
							type='button'
							onClick={() => updateAttributes({ align: 'center' })}>
							<AlignCenter className='size-4' />
						</Button>
						<Button
							size='icon'
							type='button'
							className={cn('size-7', node.attrs.align === 'right' && 'bg-accent')}
							variant='ghost'
							onClick={() => updateAttributes({ align: 'right' })}>
							<AlignRight className='size-4' />
						</Button>
						<Separator orientation='vertical' className='h-[20px]' />
						<DropdownMenu open={openedMore} onOpenChange={setOpenedMore}>
							<DropdownMenuTrigger asChild>
								<Button size='icon' className='size-7' variant='ghost' type='button'>
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
													ref={fileInputRef}
													type='file'
													accept='image/*'
													onChange={handleFileChange}
													className='hidden'
													id='replace-image-upload'
												/>
												<label
													htmlFor='replace-image-upload'
													className='flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-4 hover:bg-accent'>
													{isPending ? (
														<Icon name='LoaderCircle' className='h-4 w-4 animate-spin' />
													) : (
														<Fragment>
															<Icon name='Image' size={24} />
															<Typography variant='small'>
																{t('ns_common:editor.click_to_upload')}
															</Typography>
														</Fragment>
													)}
												</label>
												{error && <p className='mt-2 text-xs text-destructive'>{error}</p>}
											</Div>
											<Separator className='relative'>
												<Typography
													variant='small'
													className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs uppercase'>
													{t('ns_common:others.or')}
												</Typography>
											</Separator>
											<Div>
												{/* <p className='mb-2 text-xs font-medium'>Or use URL</p> */}
												<Div className='space-y-2'>
													<Input
														value={imageUrl}
														onChange={(e) => setImageUrl(e.target.value)}
														placeholder={t('ns_common:form_placeholder.fill', {
															object: 'URL',
															defaultValue: null
														})}
														className='text-xs'
													/>
													<Button
														onClick={handleImageUrlSubmit}
														className='w-full'
														type='button'
														disabled={!imageUrl}
														size='sm'>
														{t('ns_common:editor.replace_with_url')}
													</Button>
												</Div>
											</Div>

											<Div className='space-y-2'>
												<Label className='text-xs'>{t('ns_common:editor.alt_text')}</Label>
												<Input
													value={altText}
													onChange={(e) => setAltText(e.target.value)}
													placeholder='Alt text (optional)'
													className='text-xs'
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
