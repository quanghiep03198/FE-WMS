import AppLogo from '@/app/_components/_shared/-app-logo'
import { BreakPoints } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import { Div, Icon, Separator, Sheet, SheetContent, buttonVariants } from '@/components/ui'
import { navigationConfig } from '@/configs/navigation.config'
import { Link } from '@tanstack/react-router'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

type DrawerSidebarProps = {
	open: boolean
	onOpenStateChange: React.Dispatch<React.SetStateAction<boolean>>
}

const NavDrawerSidebar: React.FC<DrawerSidebarProps> = (props) => {
	const { t } = useTranslation('ns_common')
	const isLargeScreen = useMediaQuery(BreakPoints.LARGE)
	const isExtraLargeScreen = useMediaQuery(BreakPoints.EXTRA_LARGE)

	const open = useMemo(() => {
		if (isLargeScreen || isExtraLargeScreen) return false
		return props.open
	}, [props.open, isLargeScreen, isExtraLargeScreen])

	return (
		<Sheet open={open} onOpenChange={props.onOpenStateChange}>
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
								<MenuItem key={item.id} onClick={() => props.onOpenStateChange(false)}>
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
								<MenuItem key={item.id} onClick={() => props.onOpenStateChange(false)}>
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
				</Menu>
			</SheetContent>
		</Sheet>
	)
}

const Menu = tw.ul`flex flex-col gap-y-2`
const MenuItem = tw.li`whitespace-nowrap font-normal`

export default NavDrawerSidebar
