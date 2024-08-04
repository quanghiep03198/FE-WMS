import { LanguageDropdown } from '@/app/_components/_shared/-language-selector'
import { BreakPoints } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import { Badge, Button, Div, Icon, Separator, Tooltip, Typography } from '@/components/ui'
import { useKeyPress } from 'ahooks'
import { pick } from 'lodash'
import React, { Fragment, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import ThemeToggle from '../../../_components/_shared/-theme-toggle'
import { useLayoutStore } from '../../_stores/layout.store'
import NavBreadcrumb from './-nav-breadcrumb'
import NavUserControl from './-nav-user-controller'
import SearchDialog from './-search-dialog'

const Navbar: React.FC = () => {
	const [open, setOpen] = React.useState<boolean>(false)
	const { logout } = useAuth()

	const isSmallScreen = useMediaQuery(BreakPoints.SMALL)

	useKeyPress('ctrl.q', (e) => {
		e.preventDefault()
		logout()
	})

	return (
		<Fragment>
			<Div as='header' role='menubar' className='sticky top-0 z-50 bg-background/80 px-6 py-4 backdrop-blur sm:px-2'>
				<Div
					as='nav'
					role='menu'
					className='flex items-center justify-between rounded border border-border bg-background px-3 py-2'>
					<Div role='group' className='flex items-center gap-x-4'>
						<ToggleSidebarButton />
						<Separator orientation='vertical' className='h-5 w-1 sm:hidden md:hidden' />
						<NavBreadcrumb />
					</Div>

					<Div role='group' className='flex flex-1 items-center justify-end gap-x-2'>
						<Button
							variant={isSmallScreen ? 'ghost' : 'outline'}
							size={isSmallScreen ? 'icon' : 'default'}
							className='basis-56 gap-x-2 px-2 sm:basis-auto'
							onClick={() => setOpen(!open)}>
							<Icon name='Search' />
							<Typography variant='small' className='sm:hidden'>
								Search ...
							</Typography>
							<Badge variant='secondary' className='ml-auto font-mono font-normal tracking-widest sm:hidden'>
								ctrl+k
							</Badge>
						</Button>
						<LanguageDropdown triggerProps={{ variant: 'ghost' }} />
						<ThemeToggle />
						<NavUserControl />
					</Div>
				</Div>
			</Div>

			<SearchDialog open={open} onOpenChange={setOpen} />
		</Fragment>
	)
}

const ToggleSidebarButton = memo(() => {
	const { toggleNavSidebarOpen } = useLayoutStore(
		useShallow((state) => pick(state, ['navSidebarOpen', 'toggleNavSidebarOpen']))
	)
	const { t } = useTranslation()
	const isLargeScreen = useMediaQuery(BreakPoints.LARGE)

	return (
		<Tooltip
			message={`${t('ns_common:actions.toggle_sidebar')} (ctrl+b)`}
			triggerProps={{ asChild: true }}
			contentProps={{ side: 'bottom', align: 'start' }}>
			<Button size='icon' variant='ghost' disabled={isLargeScreen} onClick={toggleNavSidebarOpen}>
				<Icon name='Menu' />
			</Button>
		</Tooltip>
	)
})

export default memo(Navbar)
