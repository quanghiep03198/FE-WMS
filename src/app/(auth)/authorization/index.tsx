import { Div, Icon } from '@/components/ui'
import { AuthService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { Navigate, createFileRoute, useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import { pick } from 'lodash-es'
import { object, string, type infer as Infer } from 'zod'

const authorizationSearchSchema = object({
	token: string(),
	company_code: string(),
	company_name: string()
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
		await AuthService.profile({ signal: abortController.signal })
		useAuthStore.getState().setUserCompany(pick(deps.search, ['company_code', 'company_name']))
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
