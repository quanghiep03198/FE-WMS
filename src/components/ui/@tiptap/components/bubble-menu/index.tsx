import {
	Button,
	Div,
	Form,
	Icon,
	InputFieldControl,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Separator,
	Tooltip
} from '@/components/ui'
import useCopyToClipboard from '@hooks/use-copy-to-clipboard'

import { zodResolver } from '@hookform/resolvers/zod'
import type { Editor } from '@tiptap/react'
import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react/menus'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { object, url, type infer as Infer } from 'zod'

type FormValue = Infer<typeof LinkSchema>

const LinkSchema = object({
	href: url().optional()
})

const BubbleMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
	const [copyToClipboard] = useCopyToClipboard()
	const form = useForm<FormValue>({
		resolver: zodResolver(LinkSchema),
		defaultValues: { href: editor.getAttributes('link').href }
	})
	const [popoverOpen, setPopoverOpen] = useState<boolean>(false)

	useEffect(() => {
		form.reset({ href: editor.getAttributes('link').href })
	}, [editor])

	const handleEditLink = ({ href }: FormValue) => {
		if (href) editor.commands.setLink({ href: href })
		setPopoverOpen(!popoverOpen)
	}

	const handleCopyLinkToClipboard = () => {
		const value = form.getValues('href')
		if (value) {
			copyToClipboard(value)
			toast.info('Đã sao chép vào bộ nhớ tạm')
		}
	}

	return (
		<TiptapBubbleMenu
			editor={editor}
			className='bg-background flex w-[256px] flex-col gap-2 rounded-md border py-2 shadow-2xl'
			style={{ zIndex: 10, transitionDuration: '200ms' }}
			shouldShow={(props) => props.editor.isActive('link')}>
			<Div className='flex items-center gap-x-2 px-2'>
				<Icon name='Globe' className='text-muted-foreground basis-[32px]' />
				<a
					href={editor.getAttributes('link').href}
					target='_blank'
					className='line-clamp-1 flex-1 text-xs'
					rel='noreferrer'>
					{editor.getAttributes('link').href}
				</a>
			</Div>
			<Separator />
			<Div className='flex items-center gap-x-px px-2'>
				<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
					<Tooltip message='Cập nhật'>
						<PopoverTrigger asChild>
							<Button variant='ghost' size='icon' className='h-8 w-8'>
								<Icon name='Pencil' />
							</Button>
						</PopoverTrigger>
					</Tooltip>
					<PopoverContent
						align='start'
						side='bottom'
						sideOffset={18}
						alignOffset={0}
						className='z-20 w-full max-w-sm'>
						<Form {...form}>
							<form
								onSubmit={(e) => {
									e.stopPropagation()
									form.handleSubmit(handleEditLink)(e)
								}}
								className='flex items-center gap-x-2'>
								<InputFieldControl name='href' type='url' className='h-8' />
								<Button type='submit' size='sm'>
									Áp dụng
								</Button>
							</form>
						</Form>
					</PopoverContent>
				</Popover>

				<Tooltip message='Copy'>
					<Button
						type='button'
						className='aspect-square h-8 w-8'
						variant='ghost'
						size='icon'
						onClick={handleCopyLinkToClipboard}>
						<Icon name='Copy' />
					</Button>
				</Tooltip>
				<Tooltip message='Unlink'>
					<Button
						type='button'
						className='aspect-square h-8 w-8'
						variant='ghost'
						size='icon'
						onClick={() => editor.commands.unsetLink()}>
						<Icon name='Unlink' />
					</Button>
				</Tooltip>
			</Div>
		</TiptapBubbleMenu>
	)
}

export default BubbleMenu
