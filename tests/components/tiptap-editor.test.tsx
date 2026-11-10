import React, { createRef, useEffect } from 'react'
import Editor, { type EditorHandle } from '@components/addons/tiptap'
import { act, render, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({ language: 'en' }))

vi.mock('react-i18next', async (importOriginal) => ({
	...(await importOriginal<typeof import('react-i18next')>()),
	useTranslation: () => ({ t: (key: string) => key, i18n: { language: state.language } })
}))
vi.mock('@components/addons/tiptap/extensions', async () => {
	const { default: StarterKit } = await import('@tiptap/starter-kit')
	return { editorExtensions: [StarterKit] }
})
vi.mock('@components/addons/tiptap/components/toolbar', () => ({ default: () => null }))
vi.mock('@components/addons/tiptap/components/bubble-menu', () => ({ default: () => null }))
vi.mock('@components/addons/tiptap/components/context-menu/common-context-menu-items', () => ({ default: () => null }))
vi.mock('@components/addons/tiptap/components/context-menu/link-context-menu-items', () => ({ default: () => null }))
vi.mock('@components/addons/tiptap/components/context-menu/table-context-menu-items', () => ({ default: () => null }))

describe('Editor lifecycle', () => {
	it('keeps the editor usable during language and editable state changes', () => {
		const ref = createRef<EditorHandle>()
		const onUpdate = vi.fn()

		function Form({ language, disabled }: { language: string; disabled: boolean }) {
			state.language = language
			useEffect(() => {
				ref.current?.commands()?.setContent(`<p>${language}</p>`)
			}, [language])
			return <Editor defaultValue='<p>Initial</p>' disabled={disabled} ref={ref} onUpdate={onUpdate} />
		}

		const { rerender, container } = render(<Form disabled={false} language='en' />)
		const initialHandle = ref.current
		expect(initialHandle?.getHTML()).toContain('en')

		rerender(<Form disabled={false} language='vi' />)
		expect(ref.current).toBe(initialHandle)
		expect(ref.current?.getHTML()).toContain('vi')

		const updateCount = onUpdate.mock.calls.length
		rerender(<Form disabled language='vi' />)
		expect(ref.current).toBe(initialHandle)
		expect(ref.current?.getHTML()).toContain('vi')
		expect(container.querySelector('.tiptap')).toHaveAttribute('contenteditable', 'false')
		expect(onUpdate).toHaveBeenCalledTimes(updateCount)

		rerender(<Form disabled={false} language='vi' />)
		expect(container.querySelector('.tiptap')).toHaveAttribute('contenteditable', 'true')
	})

	it('safely handles calls on a stale ref after the editor is destroyed', async () => {
		const ref = createRef<EditorHandle>()
		const { unmount } = render(<Editor ref={ref} />)
		const handle = ref.current
		expect(handle?.commands()).toBeDefined()

		unmount()
		await waitFor(() => expect(handle?.commands()).toBeUndefined())
		expect(handle?.getHTML()).toBe('')
		expect(handle?.isEmpty()).toBe(true)
		act(() => handle?.clearContent())
	})
})
