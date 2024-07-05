import { getUserProfileQuery } from '@/app/_composables/-user.composable'
import { useAuthStore } from '@/common/hooks/use-auth'
import { Div, Icon } from '@/components/ui'
import { AuthService } from '@/services/auth.service'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Navigate, useSearch } from '@tanstack/react-router'
import _ from 'lodash'
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
	component: () => <Authorization />,
	errorComponent: () => <Navigate to='/login' />,
	loaderDeps: ({ search }) => ({ search }),
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
		setUserCompany(_.pick(search, ['company_code', 'company_name']))
	}, [data, search])

	return <Navigate to='/dashboard' />
}
