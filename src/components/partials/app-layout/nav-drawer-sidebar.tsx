import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import AppLogo from '@components/shared/app-logo'
import { buttonVariants } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import { Separator } from '@components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@components/ui/sheet'
import { navigationConfig } from '@configs/navigation.config'
import { Link } from '@tanstack/react-router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

const NavDrawerSidebar: React.FC = () => {
	const { t } = useTranslation()
	const [open, setOpen] = useState(false)

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
					{navigationConfig.main.map((item) => {
						return (
							<MenuItem key={item.id} onClick={() => setOpen(!open)}>
								<Link
									activeProps={{ className: 'text-primary hover:text-primary' }}
									to={item.url}
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
					{navigationConfig.preferences.map((item) => {
						return (
							<MenuItem key={item.id} onClick={() => setOpen(!open)}>
								<Link
									activeProps={{ className: 'text-primary hover:text-primary' }}
									to={item.url}
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
