import { createContext, useContext, useReducer } from 'react'

export type TAction = 'CREATE' | 'UPDATE' | 'RESET' | undefined

type DialogFormActionPayload<TValue = any> = {
	dialogTitle: string | undefined
	defaultFormValues?: TValue | {}
	type?: TAction
}

type FormContext = {
	dialogFormState: DialogFormActionPayload
	dispatch: React.Dispatch<{
		type: TAction
		payload?: DialogFormActionPayload
	}>
}

const initialState: DialogFormActionPayload = { type: undefined, dialogTitle: undefined, defaultFormValues: {} }

const reducer = (_state, action: { type: TAction; payload?: DialogFormActionPayload }) => {
	switch (action.type) {
		case 'CREATE':
			return { ...action.payload, type: action.type, defaultFormValues: {} }
		case 'UPDATE':
			return { ...action.payload, type: action.type }
		case 'RESET':
			return initialState
		default:
			return initialState
	}
}

export const PageContext = createContext<FormContext>({
	dialogFormState: { type: undefined, dialogTitle: undefined, defaultFormValues: {} },
	dispatch: () => undefined
})

export const PageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [dialogFormState, dispatch] = useReducer(reducer, initialState)

	return <PageContext.Provider value={{ dialogFormState, dispatch }}>{children}</PageContext.Provider>
}

export const usePageContext = () => useContext(PageContext)
