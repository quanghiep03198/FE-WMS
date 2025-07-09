import { LanguageDropdown } from '@/app/-components/-shared/language-selector'
import useAuth from '@/common/hooks/use-auth'
import { Div, Separator } from '@/components/ui'
import { useKeyPress } from 'ahooks'
import React, { Fragment } from 'react'
import ThemeToggle from '../../../-components/-shared/theme-toggle'
import NavBreadcrumb from './nav-breadcrumb'
import NavSidebarToggler from './nav-sidebar-toggler'
import NavUserControl from './nav-user-controller'
import Notification from './notifications'
import SearchDialog from './search-dialog'

const Navbar: React.FC = () => {
	const { logout } = useAuth()

	useKeyPress('ctrl.q', (e) => {
		e.preventDefault()
		logout()
	})

	return (
		<Fragment>
			<Div
				as='header'
				role='menubar'
				className='sticky top-0 z-20 flex h-[var(--header-height)] items-center bg-background px-6 sm:px-4'>
				<Div
					as='nav'
					role='menu'
					className='flex w-full basis-full items-center justify-between rounded-md border border-border px-3 py-2'>
					<Div role='group' className='flex items-center gap-x-4'>
						<NavSidebarToggler />
						<Separator orientation='vertical' className='hidden h-5 w-1 xl:block' />
						<NavBreadcrumb />
					</Div>
					<Div role='group' className='flex flex-1 items-center justify-end gap-x-2'>
						<SearchDialog />
						<LanguageDropdown triggerProps={{ variant: 'ghost' }} />
						<ThemeToggle />
						<Notification />
						<NavUserControl />
					</Div>
				</Div>
			</Div>
		</Fragment>
	)
}

export default Navbar
