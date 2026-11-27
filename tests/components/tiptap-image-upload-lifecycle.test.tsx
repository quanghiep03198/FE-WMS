import React from 'react'
import { EditorContextProvider } from '@components/addons/tiptap/context/editor-context'
import { ImageExtension } from '@components/addons/tiptap/extensions/image.extension'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/react'
import { vi } from 'vitest'

vi.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (key: string) => key })
}))

function TestEditor({ twoImages = false }: { twoImages?: boolean }) {
	const editor = useEditor({
		extensions: [StarterKit, ImageExtension],
		content: `<img src="/old.png" alt="Old" />${twoImages ? '<img src="/second.png" alt="Second" />' : ''}`,
		immediatelyRender: true
	})
	if (!editor) return null
	return (
		<EditorContextProvider editor={editor} insertImages={() => {}} uploadImage={async () => '/files/new-image'}>
			<EditorContent editor={editor} />
		</EditorContextProvider>
	)
}

it('replaces the image when the menu closes before the file picker returns', async () => {
	const { container } = render(<TestEditor />)
	const trigger = await waitFor(() => {
		const element = container.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')
		expect(element).not.toBeNull()
		return element!
	})
	fireEvent.keyDown(trigger, { key: 'Enter' })
	fireEvent.keyDown(await screen.findByText('ns_common:editor.replace_image'), { key: 'ArrowRight' })
	const input = await screen.findByLabelText<HTMLInputElement>('ns_common:editor.click_to_upload')

	await act(async () => trigger.focus())
	await waitFor(() => expect(screen.queryByText('ns_common:editor.click_to_upload')).not.toBeInTheDocument())
	fireEvent.change(input, { target: { files: [new File(['image'], 'new.png', { type: 'image/png' })] } })

	await waitFor(() => expect(container.querySelector('figure img')).toHaveAttribute('src', '/files/new-image'))
})

it('replaces only the selected image when the editor contains multiple images', async () => {
	const user = userEvent.setup()
	const { container } = render(<TestEditor twoImages />)
	const triggers = await waitFor(() => {
		const elements = container.querySelectorAll<HTMLButtonElement>('[aria-haspopup="menu"]')
		expect(elements).toHaveLength(2)
		return elements
	})
	fireEvent.keyDown(triggers[1], { key: 'Enter' })
	fireEvent.keyDown(await screen.findByText('ns_common:editor.replace_image'), { key: 'ArrowRight' })
	const label = (await screen.findByText('ns_common:editor.click_to_upload')).closest('label')
	expect(label).not.toBeNull()
	await user.upload(label!, new File(['image'], 'new.png', { type: 'image/png' }))

	await waitFor(() => {
		const images = container.querySelectorAll('figure img')
		expect(images[0]).toHaveAttribute('src', '/old.png')
		expect(images[1]).toHaveAttribute('src', '/files/new-image')
	})
})
