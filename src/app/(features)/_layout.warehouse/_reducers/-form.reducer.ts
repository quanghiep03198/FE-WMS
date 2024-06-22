import { CommonActions } from '@/common/constants/enums'
import { ParseKeys, ResourceKeys } from 'i18next'

export type TAction = CommonActions.CREATE | CommonActions.UPDATE | undefined

export type TFormAction<TValue> = {
	type: TAction
	payload?: {
		title: string | undefined
		defaultValues?: TValue | {}
		type?: TAction
	}
}

export function formReducer<TValue>(_state, action: TFormAction<TValue>) {
	switch (action.type) {
		case CommonActions.CREATE:
			return { ...action.payload, type: action.type, defaultValues: {} }
		case CommonActions.UPDATE:
			return {
				...action.payload,
				type: action.type,
				defaultValues: action.payload.defaultValues
			}
		default:
			return {
				type: undefined,
				title: undefined,
				defaultValues: {}
			}
	}
}
