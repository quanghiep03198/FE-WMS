import type { CommonActions } from '@common/constants/enums'
import { useEventEmitter } from 'ahooks'
import { type EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext, use, useState } from 'react'
import UserResetPasswordDialog from '../components/user-reset-password-dialog'
import type { UpdateUserFormValues } from '../schemas/user.schema'

type EventEmitterValue =
	| { action: CommonActions.CREATE; payload?: never }
	| { action: CommonActions.UPDATE; payload: Required<UpdateUserFormValues> & { _id: string } }

type TPageContext = {
	event$: EventEmitter<EventEmitterValue>
	requestPasswordReset: (user: { _id: string; username: string }) => void
}

const PageContext = createContext<TPageContext>(null!)

export const PageContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const event$ = useEventEmitter<EventEmitterValue>()
	const [resetUser, setResetUser] = useState<{ _id: string; username: string } | null>(null)

	return (
		<PageContext.Provider value={{ event$, requestPasswordReset: setResetUser }}>
			{children}
			{resetUser && <UserResetPasswordDialog user={resetUser} onClose={() => setResetUser(null)} />}
		</PageContext.Provider>
	)
}

export const usePageContext = () => use(PageContext)
