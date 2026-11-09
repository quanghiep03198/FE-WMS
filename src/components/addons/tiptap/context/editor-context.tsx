import { type Editor } from '@tiptap/react'
import { createContext, use } from 'react'

type EditorContextType = {
	editor: Editor
	uploadImage: (file: File) => Promise<string>
	insertImages: (files: File[]) => void
}

export const EditorContext = createContext<EditorContextType | null>(null)

export const EditorContextProvider: React.FC<EditorContextType & React.PropsWithChildren> = ({ editor, uploadImage, insertImages, children }) => {
	return <EditorContext.Provider value={{ editor, uploadImage, insertImages }}>{children}</EditorContext.Provider>
}

export const useEditorContext = () => {
	const context = use(EditorContext)

	if (!context) {
		throw new Error('useEditorContext must be used within a ToolbarProvider')
	}

	return context
}
