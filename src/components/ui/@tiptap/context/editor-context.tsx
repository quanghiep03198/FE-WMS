import { type Editor } from '@tiptap/react'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext, use } from 'react'

type EditorContextType = {
	editor: Editor
	event$: EventEmitter<any>
}

export const EditorContext = createContext<EditorContextType>(null)

export const EditorContextProvider: React.FC<EditorContextType & React.PropsWithChildren> = ({
	editor,
	event$,
	children
}) => {
	return <EditorContext.Provider value={{ editor, event$ }}>{children}</EditorContext.Provider>
}

export const useEditorContext = () => {
	const context = use(EditorContext)

	if (!context) {
		throw new Error('useEditorContext must be used within a ToolbarProvider')
	}

	return context
}
