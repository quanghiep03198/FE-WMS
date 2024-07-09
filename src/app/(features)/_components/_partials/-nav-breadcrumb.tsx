import { useLayoutStore } from '@/app/(features)/_stores/-layout.store'
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
import { Fragment } from 'react'

const THREADS_HOLD = 3 as const

export const NavBreadcrumb: React.FC = () => {
	const breadcrumb = useLayoutStore((state) => state.breadcrumb)

	return (
		<Breadcrumb className='sm:hidden md:hidden'>
			<BreadcrumbList>
				<BreadcrumbItem className=''>
					<BreadcrumbLink asChild>
						<Link to='/'>
							<HomeIcon className='size-[1.125rem]' />
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
									<DropdownMenuItem key={index} asChild={true}>
										<Link to={item.to} params={item.params} search={item.search} className='font-semibold'>
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
