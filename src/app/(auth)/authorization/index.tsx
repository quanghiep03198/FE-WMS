import { getUserProfileQuery } from '@/app/(auth)/_composables/-use-auth-api'
import { Div, Icon } from '@/components/ui'
import { AuthService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Navigate, createFileRoute, useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import { pick } from 'lodash'
import { useEffect } from 'react'
import { z } from 'zod'

const authorizationSearchSchema = z.object({
	token: z.string(),
	company_code: z.string(),
	company_name: z.string()
})

type AuthorizationSearchParams = z.infer<typeof authorizationSearchSchema>

export const Route = createFileRoute('/(auth)/authorization/')({
	validateSearch: (search: Record<string, unknown>): AuthorizationSearchParams =>
		authorizationSearchSchema.parse(search),
	component: Authorization,
	errorComponent: AuthorizationError,
	loaderDeps: ({ search }) => ({ search }),
	pendingComponent: Loading,
	loader: async ({ deps, abortController, context: { queryClient } }) => {
		AuthService.setAccessToken(deps.search.token) // Persist access token
		return await queryClient.ensureQueryData(
			getUserProfileQuery({
				signal: abortController.signal,
				headers: { Authorization: `Bearer ${deps.search.token}` }
			})
		)
	}
})

function Authorization() {
	const { data } = useSuspenseQuery(getUserProfileQuery())
	const search = Route.useSearch()
	const { setUserProfile, setUserCompany } = useAuthStore()

	useEffect(() => {
		setUserProfile(data)
		setUserCompany(pick(search, ['company_code', 'company_name']))
	}, [data, search])

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
		<Div className='h-screen flex items-center justify-center'>
			<Icon name='LoaderCircle' className='animate-spin' /> Authorizing ...
		</Div>
	)
}
