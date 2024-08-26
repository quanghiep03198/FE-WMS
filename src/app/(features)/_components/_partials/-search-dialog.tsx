import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
	Dialog,
	Icon,
	Typography
} from '@/components/ui'
import { navigationConfig } from '@/configs/navigation.config'
import { GearIcon, PersonIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { useKeyPress, useResetState } from 'ahooks'
import { debounce } from 'lodash'
import React, { Fragment, memo, useEffect } from 'react'
import isEqual from 'react-fast-compare'
import { useTranslation } from 'react-i18next'

type SearchDialogProps = Required<Pick<React.ComponentProps<typeof Dialog>, 'open' | 'onOpenChange'>>

const SearchDialog: React.FC<SearchDialogProps> = ({ open, onOpenChange: handleOpenChange }) => {
	const { t } = useTranslation('ns_common')
	const [searchTerm, setSearchTerm, resetSearchTerm] = useResetState<string>('')

	useKeyPress('ctrl.k', (e) => {
		e.preventDefault()
		handleOpenChange(true)
	})

	const filteredItems = navigationConfig.filter((item) =>
		String(t(item.title, { defaultValue: item.title }))
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	)

	useEffect(() => {
		if (!open) resetSearchTerm()
	}, [open])

	return (
		<CommandDialog open={open} onOpenChange={handleOpenChange}>
			<Command shouldFilter={false}>
				<CommandInput
					placeholder='Type a command or search...'
					className='h-9 items-center'
					onValueChange={debounce((value) => setSearchTerm(value), 200)}
				/>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandList className='scrollbar'>
					{!searchTerm ? (
						<Fragment>
							<CommandGroup heading='Suggestions'>
								{navigationConfig.slice(0, 5).map((item) => (
									<CommandItem key={item.id} asChild>
										<Link
											className='flex items-center gap-x-2'
											to={item.path}
											onClick={() => handleOpenChange(false)}>
											<Icon name={item.icon} />
											{t(item.title, { defaultValue: item.title })}
											<CommandShortcut>{String(item.keybinding).split('.').join('+')}</CommandShortcut>
										</Link>
									</CommandItem>
								))}
							</CommandGroup>
							<CommandSeparator />
							<CommandGroup heading='Settings'>
								<CommandItem asChild>
									<Link to='/preferences/account'>
										<PersonIcon className='mr-2 h-4 w-4' />
										<Typography variant='small'>{t('ns_common:navigation.profile')}</Typography>
										<CommandShortcut>ctrl+alt+P</CommandShortcut>
									</Link>
								</CommandItem>
								<CommandItem asChild>
									<Link to='/preferences/appearance-settings'>
										<GearIcon className='mr-2 h-4 w-4' />
										<Typography variant='small'>{t('ns_common:navigation.settings')}</Typography>
										<CommandShortcut>ctrl+alt+S</CommandShortcut>
									</Link>
								</CommandItem>
							</CommandGroup>
						</Fragment>
					) : (
						filteredItems.length > 0 && (
							<CommandGroup heading={`${filteredItems.length} results`}>
								{filteredItems.map((item) => (
									<CommandItem key={item.id} asChild>
										<Link
											className='flex items-center gap-x-2'
											to={item.path}
											onClick={() => handleOpenChange(false)}>
											<Icon name={item.icon} />
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
		</CommandDialog>
	)
}

export default memo(SearchDialog, (prev, next) => isEqual(prev, next))
