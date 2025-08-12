import { convertBase64 } from '@/common/utils/convert-base64'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tiptap/react'
import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import tw from 'tailwind-styled-components'
import { z } from 'zod'
import { Button, Dialog, DialogContent, DialogHeader, Form, Input, InputFieldControl } from '../../..'
import { EditorContext } from '../../context/editor-context'

const UploadSchema = z.object({
	url: z.string().url('URL ảnh không hợp lệ').optional()
})

type SetImageFormProps = {
	editor: Editor
}

type FormValue = z.infer<typeof UploadSchema>

const SetImageForm: React.FC<SetImageFormProps> = ({ editor }) => {
	const { imageFormOpenState, setImageFormOpen } = useContext(EditorContext)

	const form = useForm({
		resolver: zodResolver(UploadSchema)
	})

	const handleInsertImageURL = ({ url }: FormValue) => {
		if (url) editor.commands.setImage({ src: url, alt: 'Image' })
		form.reset()
		setImageFormOpen(false)
	}

	const handleInsertImageFromDevice = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.[0]) return
		const url = (await convertBase64(e.target.files?.[0])) as string
		editor.commands.setImage({ src: url })
	}

	return (
		<>
			<Input type='file' className='hidden' id='editor-image-input' onChange={handleInsertImageFromDevice} />
			<Dialog open={imageFormOpenState} onOpenChange={setImageFormOpen}>
				<DialogContent className='items-stretch'>
					<DialogHeader className='text-left'>Chèn hình ảnh</DialogHeader>
					<Form {...form}>
						<FormDialog
							onSubmit={(e) => {
								e.stopPropagation()
								form.handleSubmit(handleInsertImageURL)(e)
							}}>
							<InputFieldControl
								type='url'
								name='url'
								className='w-full'
								placeholder='Dán URL của hình ảnh ...'
								description='Chỉ chọn hình ảnh mà bạn đã xác nhận bạn có giấy phép sử dụng.'
							/>
							<Button type='submit'>Áp dụng</Button>
						</FormDialog>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	)
}

const FormDialog = tw.form`flex flex-col items-stretch gap-y-6 w-full`

export default SetImageForm
