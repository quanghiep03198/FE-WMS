import {
	Button,
	Div,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
	Form,
	Icon,
	InputFieldControl,
	Tooltip
} from '@/components/ui'

import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tiptap/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type FormValue = z.infer<typeof TablePresetSchema>

const TablePresetSchema = z.object({
	rows: z
		.number({ required_error: 'Vui lòng nhập số hàng' })
		.or(z.string({ required_error: 'Vui lòng nhập số hàng' }))
		.transform((value) => +value)
		.refine((value) => value >= 1, { message: 'Số hàng phải lớn hơn hoặc bằng 1' }),
	cols: z
		.number({ required_error: 'Vui lòng nhập số hàng' })
		.or(z.string({ required_error: 'Vui lòng nhập số cột' }))
		.transform((value) => +value)
		.refine((value) => value >= 1, { message: 'Số cột phải lớn hơn hoặc bằng 1' })
})

const TableDropdownMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
	const form = useForm<FormValue>({
		resolver: zodResolver(TablePresetSchema),
		defaultValues: { rows: 2, cols: 2 },
		mode: 'onChange'
	})

	const handleInsertTable = ({ rows, cols }: FormValue) => {
		editor.chain().focus().insertTable({ cols: +cols, rows: +rows }).run()
	}

	return (
		<DropdownMenu>
			<Tooltip message='Bảng'>
				<DropdownMenuTrigger asChild>
					<Button size='icon' className='h-8 w-8' variant='ghost'>
						<Icon name='Table' />
					</Button>
				</DropdownMenuTrigger>
			</Tooltip>
			<DropdownMenuContent>
				<DropdownMenuLabel>Bảng</DropdownMenuLabel>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>Chèn bảng</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent className='p-4'>
							<Div className='grid gap-4'>
								<Div className='space-y-2'>
									<h4 className='text-base font-medium leading-none'>Tùy chọn bảng</h4>
									<p className='text-sm text-muted-foreground'>Chọn số số cột và hàng để tạo bảng</p>
								</Div>
								<Form {...form}>
									<form
										className='flex flex-col items-stretch gap-y-6'
										onSubmit={(e) => {
											e.stopPropagation()
											form.handleSubmit(handleInsertTable)(e)
										}}>
										<InputFieldControl type='number' name='rows' label='Số hàng' />
										<InputFieldControl type='number' name='cols' label='Số cột' />
										<Button type='submit' size='sm' className='gap-x-2'>
											<Icon name='CirclePlus' /> Chèn bảng
										</Button>
									</form>
								</Form>
							</Div>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem className='gap-x-2' onClick={() => editor.chain().focus().addRowBefore().run()}>
						<Icon name='Plus' />
						Chèn 1 hàng bên dưới
					</DropdownMenuItem>
					<DropdownMenuItem className='gap-x-2' onClick={() => editor.chain().focus().addRowBefore().run()}>
						<Icon name='Plus' />
						Chèn 1 hàng bên trên
					</DropdownMenuItem>
					<DropdownMenuItem className='gap-x-2' onClick={() => editor.chain().focus().addColumnBefore().run()}>
						<Icon name='Plus' />
						Chèn 1 cột bên trái
					</DropdownMenuItem>
					<DropdownMenuItem className='gap-x-2' onClick={() => editor.chain().focus().addColumnAfter().run()}>
						<Icon name='Plus' />
						Chèn 1 cột bên phải
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem className='gap-x-2' onClick={() => editor.chain().focus().deleteRow().run()}>
						<Icon name='Trash2' />
						Xóa hàng
					</DropdownMenuItem>
					<DropdownMenuItem className='gap-x-2' onClick={() => editor.chain().focus().deleteColumn().run()}>
						<Icon name='Trash2' />
						Xóa cột
					</DropdownMenuItem>
					<DropdownMenuItem className='gap-x-2' onClick={() => editor.chain().focus().deleteTable().run()}>
						<Icon name='Trash2' />
						Xóa bảng
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default TableDropdownMenu
