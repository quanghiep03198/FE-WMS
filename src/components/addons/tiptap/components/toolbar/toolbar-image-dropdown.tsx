import React, { Fragment, useId, useState } from 'react'
import tw from 'tailwind-styled-components'
import { Tooltip } from '../../../../customs/tooltip'
import { InputFieldControl } from '../../../../forms/input'
import { Button } from '../../../../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../../../../ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../../ui/dropdown-menu'
import { Form } from '../../../../ui/form'
import { Icon } from '../../../../ui/icon'
import { Label } from '../../../../ui/label'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { object, url, type infer as Infer } from 'zod'
import { useEditorContext } from '../../context/editor-context'

const uploadSchema = object({
	url: url('Invalid image URL').optional()
})

const ImageDropdown: React.FC = () => {
	const { editor } = useEditorContext()
	const dialogTriggerId = useId()
	const { t } = useTranslation()
	const form = useForm<Infer<typeof uploadSchema>>({
		resolver: zodResolver(uploadSchema)
	})
	const [dialogOpen, setDialogOpen] = useState<boolean>(false)

	return (
		<Fragment>
			<DropdownMenu>
				<Tooltip message='Chèn ảnh'>
					<DropdownMenuTrigger asChild>
						<Button className='aspect-square h-8 w-8' size='icon' variant='ghost'>
							<Icon name='ImagePlus' />
						</Button>
					</DropdownMenuTrigger>
				</Tooltip>
				<DropdownMenuContent align='end'>
					<DropdownMenuItem asChild>
						<Label
							className='flex items-center gap-x-2 font-normal'
							htmlFor='image-upload'
							onClick={() => {
								editor?.chain().focus().insertImagePlaceholder().run()
							}}>
							<Icon name='Upload' /> {t('ns_common:editor.choose_image_from_device')}
						</Label>
					</DropdownMenuItem>
					<DropdownMenuItem asChild className='gap-x-2'>
						<label htmlFor={dialogTriggerId}>
							<Icon name='Link2' /> {t('ns_common:editor.choose_from_url')}
						</label>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogTrigger className='hidden' id={dialogTriggerId} />
				<DialogContent className='items-stretch'>
					<DialogHeader className='text-left'>{t('ns_common:editor.add_image')}</DialogHeader>
					<Form {...form}>
						<FormDialog
							onSubmit={(e) => {
								e.stopPropagation()
								form.handleSubmit((value) => {
									editor.commands.setImage({ src: value.url, alt: 'Image' })
									form.reset()
									setDialogOpen(false)
								})(e)
							}}>
							<InputFieldControl
								className='w-full'
								name='url'
								placeholder={t('ns_common:form_placeholder.fill', { object: 'URL', defaultValue: null })}
								type='url'
							/>
							<Button type='submit' onClick={(e) => e.stopPropagation()}>
								{t('ns_common:actions.apply')}
							</Button>
						</FormDialog>
					</Form>
				</DialogContent>
			</Dialog>
		</Fragment>
	)
}

const FormDialog = tw.form`flex flex-col items-stretch gap-y-6 w-full`

export default ImageDropdown
