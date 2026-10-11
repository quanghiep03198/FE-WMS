import { Div } from '@components/customs/div'
import { Tooltip } from '@components/customs/tooltip'
import { InputFieldControl } from '@components/forms/input'
import { Button } from '@components/ui/button'
import {
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
	DropdownMenuTrigger
} from '@components/ui/dropdown-menu'
import { Form } from '@components/ui/form'
import { Icon } from '@components/ui/icon'

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { number, object, string, type infer as Infer } from 'zod'
import { useEditorContext } from '../../context/editor-context'

const tablePresetSchema = object({
	rows: number({ message: 'ns_common:editor.validations.' })
		.or(string({ message: 'Vui lòng nhập số hàng' }))
		.transform((value) => +value)
		.refine((value) => value >= 1, { message: 'Số hàng phải lớn hơn hoặc bằng 1' }),
	cols: number({ message: 'Vui lòng nhập số hàng' })
		.or(string({ message: 'Vui lòng nhập số cột' }))
		.transform((value) => +value)
		.refine((value) => value >= 1, { message: 'Số cột phải lớn hơn hoặc bằng 1' })
})

type FormValue = Infer<typeof tablePresetSchema>

const TableDropdownMenu: React.FC = () => {
	const { t } = useTranslation()

	const { editor } = useEditorContext()
	const form = useForm<FormValue>({
		resolver: zodResolver(tablePresetSchema),
		defaultValues: { rows: 2, cols: 2 },
		mode: 'onChange'
	})

	const handleInsertTable = ({ rows, cols }: FormValue) => {
		editor.chain().focus().insertTable({ cols: +cols, rows: +rows }).run()
	}

	return (
		<DropdownMenu>
			<Tooltip message={t('ns_common:editor.table')}>
				<DropdownMenuTrigger asChild>
					<Button className='h-8 w-8' size='icon' type='button' variant='ghost'>
						<Icon name='Table' />
					</Button>
				</DropdownMenuTrigger>
			</Tooltip>
			<DropdownMenuContent align='end'>
				<DropdownMenuLabel>{t('ns_common:editor.table')}</DropdownMenuLabel>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>{t('ns_common:editor.insert_table')}</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent className='p-4'>
							<Div className='grid gap-4'>
								<Div className='space-y-2'>
									<h4 className='text-base leading-none font-medium'>
										{t('ns_common:editor.table_option_title')}
									</h4>
									<p className='text-muted-foreground text-sm'>
										{t('ns_common:editor.table_option_description')}
									</p>
								</Div>
								<Form {...form}>
									<form
										className='flex flex-col items-stretch gap-y-6'
										onSubmit={(e) => {
											e.stopPropagation()
											form.handleSubmit(handleInsertTable)(e)
										}}>
										<InputFieldControl label={t('ns_common:editor.num_of_rows')} name='rows' type='number' />
										<InputFieldControl
											label={t('ns_common:editor.num_of_columns')}
											name='cols'
											type='number'
										/>
										<Button className='gap-x-2' size='sm' type='submit'>
											<Icon name='CirclePlus' /> {t('ns_common:editor.insert_table')}
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
						{t('ns_common:editor.insert_row_below')}
					</DropdownMenuItem>
					<DropdownMenuItem className='gap-x-2' onClick={() => editor.chain().focus().addRowBefore().run()}>
						<Icon name='Plus' />
						{t('ns_common:editor.insert_row_above')}
					</DropdownMenuItem>
					<DropdownMenuItem className='gap-x-2' onClick={() => editor.chain().focus().addColumnBefore().run()}>
						<Icon name='Plus' />
						{t('ns_common:editor.insert_column_left')}
					</DropdownMenuItem>
					<DropdownMenuItem className='gap-x-2' onClick={() => editor.chain().focus().addColumnAfter().run()}>
						<Icon name='Plus' />
						{t('ns_common:editor.insert_column_right')}
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem className='gap-x-2' onClick={() => editor.chain().focus().deleteRow().run()}>
						<Icon name='Trash2' />
						{t('ns_common:editor.delete_row')}
					</DropdownMenuItem>
					<DropdownMenuItem className='gap-x-2' onClick={() => editor.chain().focus().deleteColumn().run()}>
						<Icon name='Trash2' />
						{t('ns_common:editor.delete_column')}
					</DropdownMenuItem>
					<DropdownMenuItem className='gap-x-2' onClick={() => editor.chain().focus().deleteTable().run()}>
						<Icon name='Trash2' />
						{t('ns_common:editor.delete_table')}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default TableDropdownMenu
