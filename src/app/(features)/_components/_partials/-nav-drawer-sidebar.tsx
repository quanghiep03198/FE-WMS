import AppLogo from '@/app/_components/_shared/-app-logo'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import { $mediaQuery } from '@/common/utils/media-query'
import { Div, Icon, Separator, Sheet, SheetContent, buttonVariants } from '@/components/ui'
import { navigationConfig } from '@/configs/navigation.config'
import { Link } from '@tanstack/react-router'
import { pick } from 'lodash'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useShallow } from 'zustand/react/shallow'
import { useLayoutStore } from '../../_stores/-layout.store'

const NavDrawerSidebar: React.FC = () => {
	const { t } = useTranslation()
	const { navSidebarOpen, toggleNavSidebarOpen } = useLayoutStore(
		useShallow((state) => pick(state, ['navSidebarOpen', 'toggleNavSidebarOpen']))
	)
	const isLargeScreen = useMediaQuery($mediaQuery({ minWidth: 1024 }))

	if (isLargeScreen) return null

	return (
		<Sheet defaultOpen={false} open={navSidebarOpen} onOpenChange={toggleNavSidebarOpen}>
			<SheetContent className='w-full max-w-xs' side='left'>
				<Div className='h-16 px-4'>
					<AppLogo />
				</Div>
				{/* Navigation menu */}
				<Menu>
					{navigationConfig
						.filter((item) => item.type === 'main')
						.map((item) => {
							return (
								<MenuItem key={item.id} onClick={() => toggleNavSidebarOpen()}>
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
					{navigationConfig
						.filter((item) => item.type === 'preference' && item.path != '/profile')
						.reverse()
						.map((item) => {
							return (
								<MenuItem key={item.id} onClick={() => toggleNavSidebarOpen()}>
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

export default memo(NavDrawerSidebar)
