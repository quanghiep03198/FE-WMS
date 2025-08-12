import { Editor } from '@tiptap/react'
import React, { useContext } from 'react'
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Icon,
	Label,
	Tooltip
} from '../../..'

import { EditorContext } from '../../context/editor-context'

const ImageDropdown: React.FC<{ editor: Editor }> = ({ editor }) => {
	const { setImageFormOpen } = useContext(EditorContext)

	if (!editor) {
		return null
	}

	return (
		<DropdownMenu>
			<Tooltip message='Chèn ảnh'>
				<DropdownMenuTrigger asChild>
					<Button variant='outline' size='icon' className='aspect-square h-8 w-8'>
						<Icon name='Image' />
					</Button>
				</DropdownMenuTrigger>
			</Tooltip>
			<DropdownMenuContent>
				<DropdownMenuItem asChild>
					<Label htmlFor='editor-image-input' className='flex items-center gap-x-2'>
						<Icon name='Upload' /> Tải lên từ máy tính
					</Label>
				</DropdownMenuItem>
				<DropdownMenuItem className='gap-x-2' onClick={() => setImageFormOpen(true)}>
					<Icon name='Link2' /> Theo URL
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default ImageDropdown
