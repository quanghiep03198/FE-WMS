import NotFoundPage from '@/app/-components/-errors/not-found'
import useAuth from '@/common/hooks/use-auth'
import { routeTree } from '@/route-tree.gen'
import { RouterProvider as BrowserRouterProvider, createRouter, RouterProps } from '@tanstack/react-router'
import { queryClient } from './query-client-provider'

type CreateRouterOptions = FirstParameter<typeof createRouter>

const RELOAD_STORAGE_KEY = 'chunk-reload-retry'

/**
 * Detects stale chunk/module load errors caused by new deployments.
 * After a new build, old JS chunk filenames (with content hashes) no longer exist on the server,
 * resulting in 404 errors when the browser tries to lazy-load them.
 */
function isChunkLoadError(error: unknown): boolean {
	if (!(error instanceof Error)) return false

	const message = error.message.toLowerCase()
	return (
		// Vite/Rollup dynamic import errors
		message.includes('failed to fetch dynamically imported module') ||
		// Webpack chunk load errors
		message.includes('loading chunk') ||
		message.includes('loading css chunk') ||
		// Generic network/fetch failures for JS modules
		(message.includes('fetch') && message.includes('error')) ||
		error.name === 'ChunkLoadError'
	)
}

// Set up a Router instance
export const router = createRouter({
	routeTree,
	context: { queryClient, isAuthenticated: false, serviceWorker: {} },
	defaultPreload: 'intent',
	defaultNotFoundComponent: NotFoundPage,
	defaultPreloadStaleTime: 0,
	defaultStructuralSharing: true,
	scrollRestoration: true,
	defaultOnCatch: (error) => {
		// Handle stale chunk errors after new deployment (dynamic import 404)
		if (isChunkLoadError(error)) {
			const lastReload = sessionStorage.getItem(RELOAD_STORAGE_KEY)
			const now = Date.now()

			// Prevent infinite reload loop — only retry once within 10 seconds
			if (!lastReload || now - Number(lastReload) > 10_000) {
				sessionStorage.setItem(RELOAD_STORAGE_KEY, String(now))
				window.location.reload()
				return
			}
		}

		throw error
	}
} as unknown as CreateRouterOptions)

// Register things for typesafety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

export const RouterProvider: React.FC<Pick<RouterProps, 'context'>> = ({ context: extendedContext }) => {
	const { isAuthenticated } = useAuth()

	return <BrowserRouterProvider router={router} context={{ queryClient, isAuthenticated, ...extendedContext }} />
}
