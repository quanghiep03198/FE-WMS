import { CommonActions } from '@/common/constants/enums'
import { createContext, useReducer } from 'react'

type TAction = 'CREATE' | 'UPDATE' | 'RESET' | undefined

type DialogFormActionPayload<TValue = any> = {
	dialogTitle: string | undefined
	defaultFormValues?: TValue | {}
	actionType?: TAction
}

type FormContext = {
	dialogFormState: DialogFormActionPayload
	dispatch: React.Dispatch<{
		type: TAction
		payload?: DialogFormActionPayload
	}>
}

const initialState: DialogFormActionPayload = { actionType: undefined, dialogTitle: undefined, defaultFormValues: {} }

const reducer = (_state, action: { type: TAction; payload?: DialogFormActionPayload }) => {
	switch (action.type) {
		case 'CREATE':
			return {
				...action.payload,
				actionType: action.type,
				defaultFormValues: {}
			}
		case 'UPDATE':
			return {
				...action.payload,
				actionType: action.type
			}
		case 'RESET':
			return initialState
		default:
			return initialState
	}
}

export const PageContext = createContext<FormContext>({
	dialogFormState: { actionType: undefined, dialogTitle: undefined, defaultFormValues: {} },
	dispatch: () => undefined
})

export const PageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [dialogFormState, dispatch] = useReducer(reducer, initialState)

	return <PageContext.Provider value={{ dialogFormState, dispatch }}>{children}</PageContext.Provider>
}
