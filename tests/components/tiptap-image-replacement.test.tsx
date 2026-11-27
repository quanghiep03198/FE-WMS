import { EditorContextProvider } from '@components/addons/tiptap/context/editor-context'
import { ImageExtension } from '@components/addons/tiptap/extensions/image.extension'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/react'
import { useState } from 'react'
import { vi } from 'vitest'

vi.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (key: string) => key })
}))

function TestEditor({ uploadImage }: { uploadImage: (file: File) => Promise<string> }) {
	const [, setUploading] = useState(false)
	const editor = useEditor({
		extensions: [StarterKit, ImageExtension],
		content: '<p>Text</p><img src="/old.png" alt="Old" />',
		immediatelyRender: true
	})
	if (!editor) return null
	return (
		<EditorContextProvider
			editor={editor}
			insertImages={() => {}}
			uploadImage={async (file) => {
				setUploading(true)
				try {
					return await uploadImage(file)
				} finally {
					setUploading(false)
				}
			}}>
			<EditorContent editor={editor} />
		</EditorContextProvider>
	)
}

it('replaces an image with the uploaded image', async () => {
	let completeUpload!: (url: string) => void
	const uploadImage = vi.fn(() => new Promise<string>((resolve) => (completeUpload = resolve)))
	const { container } = render(<TestEditor uploadImage={uploadImage} />)

	const trigger = await waitFor(() => {
		const element = container.querySelector('[data-state][aria-haspopup="menu"]')
		expect(element).not.toBeNull()
		return element!
	})
	fireEvent.keyDown(trigger, { key: 'Enter' })
	const replace = await screen.findByText('ns_common:editor.replace_image')
	fireEvent.keyDown(replace, { key: 'ArrowRight' })
	const input = await screen.findByLabelText('ns_common:editor.click_to_upload')
	fireEvent.change(input, { target: { files: [new File(['image'], 'new.png', { type: 'image/png' })] } })

	await act(async () => completeUpload('/files/new-image'))
	await waitFor(() => expect(container.querySelector('figure img')).toHaveAttribute('src', '/files/new-image'))
})
