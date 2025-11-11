import { navigationConfig } from '@/app/(features)/-configs/navigation.config'
import useMediaQuery from '@/common/hooks/use-media-query'
import {
	Button,
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
	Icon,
	Tooltip,
	Typography
} from '@/components/ui'
import { Kbd, KbdKey } from '@/components/ui/@custom/kbd'
import { Link } from '@tanstack/react-router'
import { useKeyPress, useResetState } from 'ahooks'
import { debounce } from 'lodash'
import React, { Fragment, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

const SearchDialog: React.FC = () => {
	const { t } = useTranslation('ns_common')
	const [searchTerm, setSearchTerm, resetSearchTerm] = useResetState<string>('')
	const [open, setOpen] = React.useState<boolean>(false)
	const isSmallScreen = useMediaQuery('(min-width: 360px) and (max-width: 1023px)')

	useKeyPress('ctrl.k', (e) => {
		e.preventDefault()
		setOpen(true)
	})

	const filteredItems = Object.values(navigationConfig)
		.flat()
		.flatMap((item) => {
			if (Array.isArray(item.items)) return item.items
			return item
		})
		.filter((item) => {
			return (
				typeof item.url === 'string' &&
				String(t(item.title, { defaultValue: item.title }))
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
			)
		})

	useEffect(() => {
		if (!open) resetSearchTerm()
	}, [open])

	return (
		<Fragment>
			<Tooltip
				message={t('ns_common:actions.search')}
				triggerProps={{ asChild: true }}
				contentProps={{ hidden: !isSmallScreen }}>
				<Button
					variant={isSmallScreen ? 'ghost' : 'outline'}
					size={isSmallScreen ? 'icon' : 'default'}
					className='basis-56 gap-x-2 px-2 sm:basis-auto md:basis-auto'
					onClick={() => setOpen(!open)}>
					<Icon name='Search' />
					<Typography variant='small' className='flex-1 text-left sm:hidden md:hidden'>
						{t('ns_common:actions.search') + ' ...'}
					</Typography>
					<Kbd className='text-xs sm:hidden md:hidden'>
						<KbdKey>ctrl</KbdKey>
						<KbdKey>K</KbdKey>
					</Kbd>
				</Button>
			</Tooltip>

			{createPortal(
				<CommandDialog open={open} onOpenChange={setOpen}>
					<Command shouldFilter={false}>
						<CommandInput
							placeholder={t('ns_common:actions.search') + ' ...'}
							className='h-9 items-center'
							onValueChange={debounce((value) => setSearchTerm(value), 200)}
						/>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandList className='max-h-[50vh] min-h-full'>
							{!searchTerm ? (
								<Fragment>
									<CommandGroup heading={t('ns_common:titles.suggestion')}>
										{navigationConfig.main
											.flatMap((item) => (Array.isArray(item.items) ? item.items : [item]))
											.slice(0, 5)
											.map((item, index) => (
												<CommandItem asChild className='h-9 text-sm' key={index.toString()}>
													<Link to={item.url} onClick={() => setOpen(false)}>
														{t(item.title, { defaultValue: item.title })}
														{item.keybinding && (
															<CommandShortcut>
																{String(item.keybinding).split('.').join('+')}
															</CommandShortcut>
														)}
													</Link>
												</CommandItem>
											))}
									</CommandGroup>
									<CommandSeparator />
									<CommandGroup heading={t('ns_common:navigation.settings')}>
										<CommandItem asChild className='h-9 text-sm'>
											<Link to='/preferences/account'>
												{t('ns_common:navigation.profile')}
												<CommandShortcut>ctrl+alt+P</CommandShortcut>
											</Link>
										</CommandItem>
										<CommandItem asChild className='h-9 text-sm'>
											<Link to='/preferences/appearance-settings'>
												{t('ns_common:navigation.settings')}
												<CommandShortcut>ctrl+alt+S</CommandShortcut>
											</Link>
										</CommandItem>
									</CommandGroup>
								</Fragment>
							) : (
								filteredItems.length > 0 && (
									<CommandGroup heading={`${filteredItems.length} results`}>
										{filteredItems.map((item, index) => (
											<CommandItem key={index.toString()} asChild={true} className='h-9 text-sm'>
												<Link
													className='flex items-center gap-x-2'
													to={item.url}
													onClick={() => setOpen(false)}>
													{t(item.title, { defaultValue: item.title })}
													<CommandShortcut>{String(item.keybinding).split('.').join('+')}</CommandShortcut>
												</Link>
											</CommandItem>
										))}
									</CommandGroup>
								)
							)}
						</CommandList>
					</Command>
				</CommandDialog>,
				document.body
			)}
		</Fragment>
	)
}

export default SearchDialog
