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
} from '@components/ui'
import { useBreadcrumbContext } from '@contexts/breadcrumb-context'
import { HomeIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { Fragment } from 'react'
import { v4 as uuidv4 } from 'uuid'

const THREADS_HOLD = 3 as const

const NavBreadcrumb: React.FC = () => {
	const { breadcrumb } = useBreadcrumbContext()

	return (
		<Breadcrumb className='sm:hidden md:hidden'>
			<BreadcrumbList>
				<BreadcrumbItem className=''>
					<BreadcrumbLink asChild>
						<Link preload={false} to='/dashboard'>
							<HomeIcon className='size-[1.135rem]' />
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				{breadcrumb.length > THREADS_HOLD ? (
					<Fragment>
						<DropdownMenu>
							<DropdownMenuTrigger className='flex items-center gap-1'>
								<BreadcrumbEllipsis className='h-4 w-4' />
							</DropdownMenuTrigger>
							<DropdownMenuContent align='start'>
								{breadcrumb.slice(0, THREADS_HOLD).map((item) => (
									<DropdownMenuItem asChild={true} key={uuidv4()}>
										<Link
											className='font-semibold'
											params={item.params}
											preload={false}
											search={item.search}
											to={item.to}>
											{item.text}
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
						<BreadcrumbSeparator />
						<BreadcrumbLink asChild>
							<Link
								activeProps={{ className: 'text-foreground' }}
								params={breadcrumb[breadcrumb.length - 1].params}
								preload={false}
								search={breadcrumb[breadcrumb.length - 1].search}
								to={breadcrumb[breadcrumb.length - 1].to}>
								{breadcrumb.at(-1)?.text}
							</Link>
						</BreadcrumbLink>
					</Fragment>
				) : (
					breadcrumb.map((item, index) => (
						<Fragment key={uuidv4()}>
							<BreadcrumbItem>
								<BreadcrumbLink asChild={true} key={uuidv4()}>
									<Link
										activeProps={{ className: 'text-foreground' }}
										className='font-medium'
										params={item.params}
										preload={false}
										search={item.search}
										to={item.to}>
										{item.text}
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

export default NavBreadcrumb
