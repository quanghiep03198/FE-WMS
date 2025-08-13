import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tiptap/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
	Button,
	Div,
	Form,
	Icon,
	InputFieldControl,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Tooltip,
	Typography
} from '../../..'

const UrlSchema = z.object({ url: z.string().url({ message: 'URL không hợp lệ' }).optional() })

export const LinkPopover: React.FC<{ editor: Editor }> = ({ editor }) => {
	const [open, setOpen] = useState<boolean>(false)

	const form = useForm<z.infer<typeof UrlSchema>>({
		resolver: zodResolver(UrlSchema)
	})

	const handleInsertLink = ({ url }: z.infer<typeof UrlSchema>) => {
		if (!url) return
		// empty
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run()
			return
		}
		// update link
		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
		form.reset()
		setOpen(false)
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<Tooltip message='Chèn link'>
				<PopoverTrigger asChild>
					<Button variant='ghost' size='icon' className='aspect-square h-8 w-8'>
						<Icon name='Link' />
					</Button>
				</PopoverTrigger>
			</Tooltip>
			<PopoverContent className='w-80'>
				<Div className='grid gap-4'>
					<Div className='space-y-2'>
						<Typography className='font-medium leading-none'>Chèn link</Typography>
						<p className='text-sm text-muted-foreground'>Chèn 1 đường liên kết vào văn bản đã chọn</p>
					</Div>
					<Form {...form}>
						<form
							className='flex items-stretch gap-x-2'
							onSubmit={(e) => {
								e.stopPropagation()
								form.handleSubmit(handleInsertLink)(e)
							}}>
							<InputFieldControl
								placeholder='Dán 1 đường liên kết'
								name='url'
								className='col-span-2 !h-8 text-sm'
							/>
							<Button variant='default' size='sm'>
								Áp dụng
							</Button>
						</form>
					</Form>
				</Div>
			</PopoverContent>
		</Popover>
	)
}
