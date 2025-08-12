import { type Editor } from '@tiptap/react'
import { createContext, use, useState } from 'react'

type EditorContextType = {
	editor: Editor
	imageFormOpenState: boolean
	setImageFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const EditorContext = createContext<EditorContextType>(null)

export const EditorContextProvider: React.FC<{ editor: Editor } & React.PropsWithChildren> = ({ editor, children }) => {
	const [imageFormOpenState, setImageFormOpen] = useState<boolean>()

	return (
		<EditorContext.Provider value={{ editor, imageFormOpenState, setImageFormOpen }}>
			{children}
		</EditorContext.Provider>
	)
}

export const useEditorContext = () => {
	const context = use(EditorContext)

	if (!context) {
		throw new Error('useEditorContext must be used within a ToolbarProvider')
	}

	return context
}
