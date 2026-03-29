import type { FactoryCode } from '@/common/constants/enums'
import { Div, Icon } from '@/components/ui'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
import { useAuthStore } from '@/stores/auth.store'
import { Navigate, createFileRoute, useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import { object, string, type infer as Infer } from 'zod'

const authorizationSearchSchema = object({
	token: string(),
	factory_code: string()
})

type AuthorizationSearchParams = Infer<typeof authorizationSearchSchema>

export const Route = createFileRoute('/(auth)/authorization/')({
	validateSearch: (search: Record<string, unknown>): AuthorizationSearchParams =>
		authorizationSearchSchema.parse(search),
	component: Authorization,
	errorComponent: AuthorizationError,
	loaderDeps: ({ search }) => ({ search }),
	pendingComponent: Loading,
	loader: async ({ deps, abortController }) => {
		AuthService.setAccessToken(deps.search.token) // Persist access token
		await UserService.profile({ signal: abortController.signal })
		useAuthStore.getState().setCurrentFactory(deps.search.factory_code as FactoryCode)
	}
})

function Authorization() {
	return <Navigate to='/dashboard' />
}

function AuthorizationError({ reset }: ErrorComponentProps) {
	const router = useRouter()
	router.invalidate().finally(() => {
		reset()
		AuthService.logout()
		router.navigate({ to: '/login' })
	})

	return null
}

function Loading() {
	return (
		<Div className='flex h-screen items-center justify-center gap-x-2'>
			<Icon name='LoaderCircle' className='animate-spin' /> Authorizing ...
		</Div>
	)
}
