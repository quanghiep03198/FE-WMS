import { type Level as HeadingLevel } from '@tiptap/extension-heading'
import { Editor } from '@tiptap/react'
import React from 'react'
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
	Icon,
	IconProps,
	Tooltip
} from '../../..'

type Level = 0 | HeadingLevel
type BlockTypeItem = { icon: IconProps['name']; label: string; value: Level }

const getCurrentStyle = (editor: Editor): BlockTypeItem => {
	switch (true) {
		case editor.isActive('heading', { level: 1 }):
			return {
				label: 'Tiêu đề 1',
				value: 1,
				icon: 'Heading1'
			}
		case editor.isActive('heading', { level: 2 }):
			return {
				label: 'Tiêu đề 2',
				value: 2,
				icon: 'Heading2'
			}
		case editor.isActive('heading', { level: 3 }):
			return {
				label: 'Tiêu đề 3',
				value: 3,
				icon: 'Heading3'
			}
		default:
			return {
				label: 'Văn bản thường',
				value: 0,
				icon: 'Text'
			}
	}
}

const PresetStyles: Array<BlockTypeItem> = [
	{ label: 'Văn bản thường', value: 0, icon: 'Text' },
	{
		label: 'Tiêu đề 1',
		value: 1,
		icon: 'Heading1'
	},
	{
		label: 'Tiêu đề 2',
		value: 2,
		icon: 'Heading2'
	},
	{
		label: 'Tiêu đề 3',
		value: 3,
		icon: 'Heading3'
	}
]

export const StyleDropdownMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
	return (
		<DropdownMenu>
			<Tooltip message='Kiểu'>
				<DropdownMenuTrigger asChild>
					<Button type='button' variant='ghost' size='sm' className='h-8 gap-x-2'>
						<Icon name={getCurrentStyle(editor).icon} /> {getCurrentStyle(editor).label}
					</Button>
				</DropdownMenuTrigger>
			</Tooltip>
			<DropdownMenuContent>
				<DropdownMenuRadioGroup
					value={getCurrentStyle(editor).value.toString()}
					onValueChange={(value) => {
						if (value === '0') {
							editor.commands.setParagraph()
							return
						}
						editor
							.chain()
							.focus()
							.toggleHeading({ level: +value as HeadingLevel })
							.run()
					}}>
					{PresetStyles.map((style) => (
						<DropdownMenuRadioItem key={style.value} value={String(style.value)} className='gap-x-2'>
							<Icon name={style.icon} /> {style.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
