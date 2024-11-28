import { useBreadcrumbContext } from '@/app/(features)/_contexts/-breadcrumb-context'
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
import { HomeIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { Fragment, memo } from 'react'
import { v4 as uuidv4 } from 'uuid'

const THREADS_HOLD = 3 as const

const NavBreadcrumb: React.FC = () => {
	const { breadcrumb } = useBreadcrumbContext()

	return (
		<Breadcrumb className='sm:hidden md:hidden'>
			<BreadcrumbList>
				<BreadcrumbItem className=''>
					<BreadcrumbLink asChild>
						<Link to='/dashboard' preload={false}>
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
								{breadcrumb.slice(0, THREADS_HOLD).map((item, index) => (
									<DropdownMenuItem key={uuidv4()} asChild={true}>
										<Link
											to={item.to}
											params={item.params}
											search={item.search}
											preload={false}
											className='font-semibold'>
											{item.text}
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
						<BreadcrumbSeparator />
						<BreadcrumbLink asChild>
							<Link
								to={breadcrumb[breadcrumb.length - 1].to}
								params={breadcrumb[breadcrumb.length - 1].params}
								search={breadcrumb[breadcrumb.length - 1].search}
								preload={false}
								activeProps={{ className: 'text-foreground' }}>
								{breadcrumb.at(-1)?.text}
							</Link>
						</BreadcrumbLink>
					</Fragment>
				) : (
					breadcrumb.map((item, index) => (
						<Fragment key={index}>
							<BreadcrumbItem>
								<BreadcrumbLink key={index} asChild={true}>
									<Link
										to={item.to}
										params={item.params}
										search={item.search}
										preload={false}
										className='font-medium'
										activeProps={{ className: 'text-foreground' }}>
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

export default memo(NavBreadcrumb)
