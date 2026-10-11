import { Div } from '@components/customs/div'
import { Tooltip } from '@components/customs/tooltip'
import { InputFieldControl } from '@components/forms/input'
import { Button } from '@components/ui/button'
import { Form } from '@components/ui/form'
import { Icon } from '@components/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { Separator } from '@components/ui/separator'
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
			className='bg-background flex w-[256px] flex-col gap-2 rounded-md border py-2 shadow-2xl'
			editor={editor}
			shouldShow={(props) => props.editor.isActive('link')}
			style={{ zIndex: 10, transitionDuration: '200ms' }}>
			<Div className='flex items-center gap-x-2 px-2'>
				<Icon className='text-muted-foreground basis-[32px]' name='Globe' />
				<a
					className='line-clamp-1 flex-1 text-xs'
					href={editor.getAttributes('link').href}
					rel='noreferrer'
					target='_blank'>
					{editor.getAttributes('link').href}
				</a>
			</Div>
			<Separator />
			<Div className='flex items-center gap-x-px px-2'>
				<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
					<Tooltip message='Cập nhật'>
						<PopoverTrigger asChild>
							<Button className='h-8 w-8' size='icon' variant='ghost'>
								<Icon name='Pencil' />
							</Button>
						</PopoverTrigger>
					</Tooltip>
					<PopoverContent
						align='start'
						alignOffset={0}
						className='z-20 w-full max-w-sm'
						side='bottom'
						sideOffset={18}>
						<Form {...form}>
							<form
								className='flex items-center gap-x-2'
								onSubmit={(e) => {
									e.stopPropagation()
									form.handleSubmit(handleEditLink)(e)
								}}>
								<InputFieldControl className='h-8' name='href' type='url' />
								<Button size='sm' type='submit'>
									Áp dụng
								</Button>
							</form>
						</Form>
					</PopoverContent>
				</Popover>

				<Tooltip message='Copy'>
					<Button
						className='aspect-square h-8 w-8'
						size='icon'
						type='button'
						variant='ghost'
						onClick={handleCopyLinkToClipboard}>
						<Icon name='Copy' />
					</Button>
				</Tooltip>
				<Tooltip message='Unlink'>
					<Button
						className='aspect-square h-8 w-8'
						size='icon'
						type='button'
						variant='ghost'
						onClick={() => editor.commands.unsetLink()}>
						<Icon name='Unlink' />
					</Button>
				</Tooltip>
			</Div>
		</TiptapBubbleMenu>
	)
}

export default BubbleMenu
