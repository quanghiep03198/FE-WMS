import { type Level as HeadingLevel } from '@tiptap/extension-heading'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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
import { useEditorContext } from '../../context/editor-context'

type Level = 0 | HeadingLevel
type BlockTypeItem = { icon: IconProps['name']; label: string; value: Level }

export const StyleDropdownMenu: React.FC = () => {
	const { editor } = useEditorContext()
	const { t, i18n } = useTranslation()

	const getCurrentStyle = ((): BlockTypeItem => {
		switch (true) {
			case editor.isActive('heading', { level: 1 }):
				return {
					label: t('ns_common:editor.heading_1'),
					value: 1,
					icon: 'Heading1'
				}
			case editor.isActive('heading', { level: 2 }):
				return {
					label: t('ns_common:editor.heading_2'),
					value: 2,
					icon: 'Heading2'
				}
			case editor.isActive('heading', { level: 3 }):
				return {
					label: t('ns_common:editor.heading_3'),
					value: 3,
					icon: 'Heading3'
				}
			default:
				return {
					label: t('ns_common:editor.normal_text'),
					value: 0,
					icon: 'Type'
				}
		}
	})()

	const presetStyles: Array<BlockTypeItem> = useMemo(
		() => [
			{ label: 'Văn bản thường', value: 0, icon: 'Type' },
			{
				label: t('ns_common:editor.heading_1'),
				value: 1,
				icon: 'Heading1'
			},
			{
				label: t('ns_common:editor.heading_2'),
				value: 2,
				icon: 'Heading2'
			},
			{
				label: t('ns_common:editor.heading_3'),
				value: 3,
				icon: 'Heading3'
			}
		],
		[i18n.language]
	)

	return (
		<DropdownMenu>
			<Tooltip message={t('ns_common:editor.typography')}>
				<DropdownMenuTrigger asChild>
					<Button type='button' variant='secondary' size='sm' className='h-8 gap-x-2'>
						<Icon name={getCurrentStyle.icon} /> {getCurrentStyle.label}
					</Button>
				</DropdownMenuTrigger>
			</Tooltip>
			<DropdownMenuContent>
				<DropdownMenuRadioGroup
					value={getCurrentStyle.value.toString()}
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
					{presetStyles.map((style) => (
						<DropdownMenuRadioItem key={style.value} value={String(style.value)} className='gap-x-2'>
							<Icon name={style.icon} /> {style.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
