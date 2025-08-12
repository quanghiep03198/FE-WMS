'use no memo'

import { Button, Div, Icon, Input } from '@/components/ui'
import { Editor } from '@tiptap/react'
import { useDebounce } from 'ahooks'
import React, { useEffect, useState } from 'react'

type FontSizeInputProps = {
	editor: Editor
}

const FONT_SIZE_MIN = 14
const FONT_SIZE_DEFAULT = 16
const FONT_SIZE_MAX = 96

const extractFontSizeValue = (attributes: Record<string, any>) => {
	const fontSize = attributes?.fontSize
	if (!fontSize) return FONT_SIZE_DEFAULT
	return Number(fontSize.replace('px', ''))
}

const FontSizeInput: React.FC<FontSizeInputProps> = ({ editor }) => {
	const [fontSize, setFontSize] = useState<number>(extractFontSizeValue(editor.getAttributes('textStyle')))
	const debouncedFontSize = useDebounce(fontSize, { wait: 200 })

	const handleChangeFontSize = (step: number) => {
		if (fontSize + step < FONT_SIZE_MIN) {
			setFontSize(FONT_SIZE_MIN)
		} else if (fontSize + step > FONT_SIZE_MAX) {
			setFontSize(FONT_SIZE_MAX)
		} else {
			setFontSize((prev) => prev + step)
		}
	}

	useEffect(() => {
		switch (true) {
			case debouncedFontSize < FONT_SIZE_MIN:
				setFontSize(FONT_SIZE_MIN)
				break
			case debouncedFontSize > FONT_SIZE_MAX:
				setFontSize(FONT_SIZE_MAX)
				break
			default:
				setFontSize(debouncedFontSize)
				break
		}
	}, [debouncedFontSize])

	useEffect(() => {
		editor.commands.setFontSize(fontSize)
	}, [fontSize])

	// const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

	// }

	return (
		<Div className='grid h-8 grid-cols-[1fr_1.25fr_1fr] items-center rounded-md border *:h-max *:rounded-none [&_button]:aspect-square [&_button]:!size-8 [&_button]:place-content-center [&_button]:p-0'>
			<Button type='button' variant='ghost' onClick={() => handleChangeFontSize(-1)}>
				<Icon name='Minus' size={14} />
			</Button>
			<Input
				type='number'
				className='focus-within:boder-none w-max rounded-none border-b-0 border-t-0 text-center outline-none focus-within:ring-0 focus-within:ring-offset-0'
				min={FONT_SIZE_MIN}
				max={FONT_SIZE_MAX}
				value={fontSize}
				onChange={(e) => setFontSize(+e.target.value)}
			/>
			<Button type='button' size='icon' variant='ghost' onClick={() => handleChangeFontSize(1)}>
				<Icon name='Plus' size={14} />
			</Button>
		</Div>
	)
}

export default FontSizeInput
