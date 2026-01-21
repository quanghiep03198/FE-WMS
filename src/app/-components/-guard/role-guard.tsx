import { UserRole } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
import { Button, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui'
import { LockIcon } from 'lucide-react'
import { Fragment } from 'react'

export const RoleGuard: React.FC<React.PropsWithChildren & { authorizedRoles: UserRole[] }> = ({
	children,
	authorizedRoles
}) => {
	const { user } = useAuth()
	const isAccessible = user && authorizedRoles.includes(user.role) && authorizedRoles !== '*'

	return (
		<Fragment>
			{!isAccessible && (
				<div className='fixed inset-0 z-[9999] grid place-items-center bg-background/80 backdrop-blur-md'>
					<Empty className='h-full bg-muted/30'>
						<EmptyHeader>
							<EmptyMedia variant='icon'>
								<LockIcon />
							</EmptyMedia>
							<EmptyTitle></EmptyTitle>
							<EmptyDescription className='max-w-xs text-pretty'>
								You&apos;re all caught up. New notifications will appear here.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button variant='outline'>Request access</Button>
						</EmptyContent>
					</Empty>
				</div>
			)}
			{children}
		</Fragment>
	)
}
