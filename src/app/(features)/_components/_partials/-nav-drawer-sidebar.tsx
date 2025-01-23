import AppLogo from '@/app/_components/_shared/-app-logo'
import { cn } from '@/common/utils/cn'
import { Div, Icon, Separator, Sheet, SheetContent, SheetTrigger, buttonVariants } from '@/components/ui'
import { navigationConfig } from '@/configs/navigation.config'
import { routeTree } from '@/route-tree.gen'
import { Link, ParseRoute } from '@tanstack/react-router'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

const NavDrawerSidebar: React.FC = () => {
	const { t } = useTranslation()
	const [open, setOpen] = useState(false)

	const mainMenu = useMemo(() => {
		return navigationConfig.filter((item) => item.type === 'main')
	}, [])

	const preferenceMenu = useMemo(() => {
		return navigationConfig.filter((item) => {
			const matches: Array<ParseRoute<typeof routeTree>['fullPath']> = [
				'/preferences/keybindings',
				'/preferences/appearance-settings'
			]
			return item.type === 'preference' && matches.includes(item.path)
		})
	}, [])

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				className={cn(buttonVariants({ variant: 'ghost', size: 'icon', className: 'lg:hidden xl:hidden' }))}>
				<Icon name='Menu' />
			</SheetTrigger>
			<SheetContent className='w-full max-w-xs lg:hidden xl:hidden' side='left'>
				<Div className='h-16 px-4'>
					<AppLogo />
				</Div>
				{/* Navigation menu */}
				<Menu>
					{mainMenu.map((item) => {
						return (
							<MenuItem key={item.id} onClick={() => setOpen(!open)}>
								<Link
									to={item.path}
									activeProps={{ className: 'text-primary hover:text-primary' }}
									className={cn(
										buttonVariants({ variant: 'ghost' }),
										'w-full justify-start gap-x-2 text-base font-normal'
									)}>
									<Icon name={item.icon!} size={18} /> {t(item.title, { defaultValue: item.title })}
								</Link>
							</MenuItem>
						)
					})}
					<Separator className='my-4' />
					{preferenceMenu.map((item) => {
						return (
							<MenuItem key={item.id} onClick={() => setOpen(!open)}>
								<Link
									to={item.path}
									activeProps={{ className: 'text-primary hover:text-primary' }}
									className={cn(
										buttonVariants({ variant: 'ghost' }),
										'w-full justify-start gap-x-2 text-base font-normal'
									)}>
									<Icon name={item.icon!} size={18} />
									{t(item.title, { ns: 'ns_common', defaultValue: item.title })}
								</Link>
							</MenuItem>
						)
					})}
				</Menu>
			</SheetContent>
		</Sheet>
	)
}

const Menu = tw.ul`flex flex-col gap-y-2`
const MenuItem = tw.li`whitespace-nowrap font-normal`

export default NavDrawerSidebar
