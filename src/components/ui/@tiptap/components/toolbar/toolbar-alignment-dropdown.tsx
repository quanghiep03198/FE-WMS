import { cn } from '@/common/utils/cn'
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

type AlignmentOption = {
	icon: IconProps['name']
	value: 'left' | 'right' | 'center' | 'justify'
	label: string
}

const PresetAlignments: Array<AlignmentOption> = [
	{
		icon: 'AlignLeft',
		value: 'left',
		label: 'Căn trái'
	},
	{
		icon: 'AlignRight',
		value: 'right',
		label: 'Căn phải'
	},
	{
		icon: 'AlignCenter',
		value: 'center',
		label: 'Căn giữa'
	},
	{
		icon: 'AlignJustify',
		value: 'justify',
		label: 'Căn đều'
	}
]

const getCurrentAlignment = (editor: Editor): Omit<AlignmentOption, 'label'> => {
	switch (true) {
		case editor.isActive({ textAlign: 'left' }):
			return {
				icon: 'AlignLeft',
				value: 'left'
			}
		case editor.isActive({ textAlign: 'right' }):
			return {
				icon: 'AlignRight',
				value: 'right'
			}
		case editor.isActive({ textAlign: 'center' }):
			return {
				icon: 'AlignCenter',
				value: 'center'
			}
		case editor.isActive({ textAlign: 'justify' }):
			return {
				icon: 'AlignJustify',
				value: 'justify'
			}

		default:
			return {
				icon: 'AlignRight',
				value: 'right'
			}
	}
}

export const AlignmentDropdownMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
	const currentAlignment = getCurrentAlignment(editor)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='icon' className='aspect-square h-8 w-8'>
					<Icon name={currentAlignment.icon} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuRadioGroup
					className='flex list-none !flex-row gap-x-2'
					value={currentAlignment.value}
					onValueChange={(value) => editor.commands.setTextAlign(value)}>
					{PresetAlignments.map((option) => (
						<Tooltip message={option.label} key={option.value}>
							<DropdownMenuRadioItem
								key={option.value}
								value={option.value}
								className={cn('p-2 hover:bg-accent hover:text-accent-foreground [&>span]:hidden', {
									'bg-secondary': currentAlignment.value === option.value
								})}>
								<Icon name={option.icon} size={16} />
							</DropdownMenuRadioItem>
						</Tooltip>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
