import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
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
import { useEditorContext } from '../../context/editor-context'

const UrlSchema = z.object({ url: z.string().url({ message: 'ns_common:editor.validations.invalid_url' }).optional() })

export const LinkPopover: React.FC = () => {
	const { editor } = useEditorContext()
	const { t } = useTranslation()

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
			<Tooltip message={t('ns_common:editor.link')}>
				<PopoverTrigger asChild>
					<Button variant='ghost' size='icon' className='aspect-square h-8 w-8'>
						<Icon name='Link' />
					</Button>
				</PopoverTrigger>
			</Tooltip>
			<PopoverContent className='w-80'>
				<Div className='grid gap-4'>
					<Div className='space-y-2'>
						<Typography className='font-medium leading-none'>
							{t('ns_common:editor.insert_link_title')}
						</Typography>
						<Typography className='text-sm text-muted-foreground'>
							{t('ns_common:editor.insert_link_description')}
						</Typography>
					</Div>
					<Form {...form}>
						<form
							className='flex items-stretch gap-x-2'
							onSubmit={(e) => {
								e.stopPropagation()
								form.handleSubmit(handleInsertLink)(e)
							}}>
							<InputFieldControl
								placeholder={t('ns_common:editor.insert_link_placeholder')}
								name='url'
								className='col-span-2 !h-8 text-sm'
							/>
							<Button variant='default' size='sm'>
								{t('ns_common:actions.apply')}
							</Button>
						</form>
					</Form>
				</Div>
			</PopoverContent>
		</Popover>
	)
}
