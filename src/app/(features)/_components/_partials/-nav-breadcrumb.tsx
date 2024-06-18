import { Fragment } from 'react'
import { HomeIcon } from '@radix-ui/react-icons'
import { Link, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui'
import { breadcrumbs } from '@/configs/breadcrumb.config'

export const NavBreadcrumb: React.FC = () => {
	const { t } = useTranslation(['ns_common'])
	const router = useRouterState()

	const breadcrumb = breadcrumbs[router.location.pathname] ?? []

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem className=''>
					<BreadcrumbLink asChild>
						<Link to='/'>
							<HomeIcon className='size-[1.125rem]' />
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				{breadcrumb.length > 3 ? (
					<Fragment>
						<DropdownMenu>
							<DropdownMenuTrigger className='flex items-center gap-1'>
								<BreadcrumbEllipsis className='h-4 w-4' />
							</DropdownMenuTrigger>
							<DropdownMenuContent align='start'>
								{breadcrumb.slice(0, 3).map((item, index) => (
									<DropdownMenuItem asChild>
										<Link to={item.href} className='font-semibold' key={index}>
											{t(item.title, { ns: 'ns_common', defaultValue: item.title })}
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
						<BreadcrumbSeparator />
						<BreadcrumbLink asChild>
							<Link to={breadcrumb[breadcrumb.length - 1].href} activeProps={{ className: 'text-foreground' }}>
								{t(breadcrumb.at(-1)?.title, { ns: 'ns_common', defaultValue: breadcrumb.at(-1)?.title })}
							</Link>
						</BreadcrumbLink>
					</Fragment>
				) : (
					breadcrumb.map((item, index) => (
						<Fragment key={index}>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link to={item.href} className='font-medium' activeProps={{ className: 'text-foreground' }}>
										{t(item.title, { ns: 'ns_common', defaultValue: item.title })}
									</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							{index < breadcrumb.length - 1 && <BreadcrumbSeparator />}
						</Fragment>
					))
				)}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
