import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginForm from '@features/auth/components/login/login-form'

const mocks = vi.hoisted(() => ({
	login: vi.fn(),
	setAccessToken: vi.fn(),
	setUserProfile: vi.fn()
}))

vi.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (key: string) => key })
}))

vi.mock('@hooks/use-auth', () => ({
	default: () => ({ setAccessToken: mocks.setAccessToken, setUserProfile: mocks.setUserProfile })
}))

vi.mock('@tanstack/react-query', () => ({
	useMutation: () => ({ mutateAsync: mocks.login, isPending: false })
}))

vi.mock('@features/auth/services/auth.service', () => ({
	AuthService: { login: mocks.login }
}))

vi.mock('@features/auth/hooks/use-profile-request', () => ({
	AuthQueryKeys: { PROFILE: 'profile' }
}))

vi.mock('@common/utils/env', () => ({
	default: () => 'factory'
}))

vi.mock('@tanstack/react-router', () => ({
	Link: ({ children, to, ...props }: React.PropsWithChildren<{ to: string }>) => (
		<a href={to} {...props}>
			{children}
		</a>
	)
}))

vi.mock('ahooks', () => ({
	useLocalStorageState: () => ['', vi.fn()]
}))

describe('login form mascot cues', () => {
	const onMascotFocusChange = vi.fn()
	const onUsernameProgressChange = vi.fn()
	const onMascotAction = vi.fn()
	const onMascotPasswordVisibilityChange = vi.fn()

	beforeEach(() => {
		vi.stubGlobal(
			'ResizeObserver',
			class {
				observe() {}
				unobserve() {}
				disconnect() {}
			}
		)
		mocks.login.mockReset().mockResolvedValue({ metadata: {} })
		onMascotFocusChange.mockReset()
		onUsernameProgressChange.mockReset()
		onMascotAction.mockReset()
		onMascotPasswordVisibilityChange.mockReset()
	})

	it('reports focused fields and username caret progress', async () => {
		render(
			<LoginForm
				onMascotFocusChange={onMascotFocusChange}
				onMascotAction={onMascotAction}
				onUsernameProgressChange={onUsernameProgressChange}
			/>
		)

		const user = userEvent.setup()
		const username = screen.getByLabelText('ns_auth:fields.username')
		await user.click(username)
		await user.type(username, 'dock')
		await user.tab()

		expect(onMascotFocusChange).toHaveBeenNthCalledWith(1, 'username')
		expect(onUsernameProgressChange).toHaveBeenLastCalledWith(4 / 22)
		expect(onMascotFocusChange).toHaveBeenNthCalledWith(2, 'none')
		expect(onMascotFocusChange).toHaveBeenNthCalledWith(3, 'password')
	})

	it('reports when the password is revealed and hidden', async () => {
		render(<LoginForm onMascotPasswordVisibilityChange={onMascotPasswordVisibilityChange} />)
		const user = userEvent.setup()
		const visibilityToggle = screen.getByRole('button', { pressed: false })

		await user.click(visibilityToggle)
		await waitFor(() => expect(onMascotPasswordVisibilityChange).toHaveBeenLastCalledWith(true))

		await user.click(visibilityToggle!)
		await waitFor(() => expect(onMascotPasswordVisibilityChange).toHaveBeenLastCalledWith(false))
	})

	it('shakes for invalid credentials without calling the login mutation', async () => {
		render(<LoginForm onMascotAction={onMascotAction} />)
		const user = userEvent.setup()

		await user.click(screen.getByRole('button', { name: 'ns_common:actions.login' }))

		await waitFor(() => expect(onMascotAction).toHaveBeenCalledWith('shake'))
		expect(mocks.login).not.toHaveBeenCalled()
	})

	it('nods on valid submission and keeps the existing login mutation', async () => {
		render(<LoginForm onMascotAction={onMascotAction} />)
		const user = userEvent.setup()

		await user.type(screen.getByLabelText('ns_auth:fields.username'), 'operator')
		await user.type(screen.getByLabelText('ns_auth:fields.password'), 'secret')
		await user.click(screen.getByRole('button', { name: 'ns_common:actions.login' }))

		await waitFor(() => expect(mocks.login).toHaveBeenCalledWith({ username: 'operator', password: 'secret' }))
		expect(onMascotAction).toHaveBeenCalledWith('nod')
	})
})
