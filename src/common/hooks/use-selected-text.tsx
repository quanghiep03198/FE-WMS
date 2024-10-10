import { useState } from 'react'

export const useSelectedText = () => {
	const [text, setText] = useState<string>('')
	const select = () => {
		const selected = window.getSelection() as Selection
		setText(selected.toString())
	}
	return [select, text] as const
}
