import { PresetBreakPoints } from '@common/constants/enums'
import {
	Badge,
	Button,
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	Icon,
	Typography
} from '@components/ui'
import useMediaQuery from '@hooks/use-media-query'
import { Link } from '@tanstack/react-router'
import { useKeyPress, useResetState } from 'ahooks'
import { debounce } from 'lodash-es'
import React, { Fragment, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { menuGroups } from './nav-sidebar'

const SearchDialog: React.FC = () => {
	const { t } = useTranslation('ns_common')
	const [searchTerm, setSearchTerm, resetSearchTerm] = useResetState<string>('')
	const [open, setOpen] = React.useState<boolean>(false)
	const isSmallScreen = useMediaQuery(PresetBreakPoints.SMALL)

	useKeyPress('ctrl.k', (e) => {
		e.preventDefault()
		setOpen(true)
	})

	const filteredItems = Object.values(menuGroups)
		.flat()
		.filter((item) =>
			String(t(item.title, { defaultValue: item.title }))
				.toLowerCase()
				.includes(searchTerm.toLowerCase())
		)

	useEffect(() => {
		if (!open) resetSearchTerm()
	}, [open])

	return (
		<Fragment>
			<Button
				variant={isSmallScreen ? 'ghost' : 'outline'}
				size={isSmallScreen ? 'icon' : 'default'}
				className='bg-background min-w-56 basis-56 gap-x-2 px-2 sm:min-w-fit sm:basis-auto'
				onClick={() => setOpen(!open)}>
				<Icon name='Search' />
				<Typography variant='small' className='sm:hidden'>
					Search ...
				</Typography>
				<Badge variant='secondary' className='ml-auto font-mono font-normal tracking-widest sm:hidden'>
					ctrl+k
				</Badge>
			</Button>

			{createPortal(
				<CommandDialog open={open} onOpenChange={setOpen}>
					<Command shouldFilter={false}>
						<CommandInput
							placeholder='Type a command or search...'
							className='h-9 items-center'
							onValueChange={debounce((value) => setSearchTerm(value), 200)}
						/>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandList className='max-h-none sm:max-h-full'>
							{!searchTerm ? (
								<Fragment>
									<CommandGroup heading='RFID Agent'>
										{menuGroups.rfidAgent.map((item) => (
											<CommandItem key={item.hash} asChild className='h-8 text-sm' value={item.hash}>
												<Link hash={item.hash} onClick={() => setOpen(false)}>
													{t(item.title, { defaultValue: item.title })}
												</Link>
											</CommandItem>
										))}
									</CommandGroup>
									<CommandSeparator />
									<CommandGroup heading='Eclipse Mosquitto'>
										{menuGroups.mosquitto.map((item) => (
											<CommandItem key={item.hash} asChild className='h-8 text-sm' value={item.hash}>
												<Link hash={item.hash} onClick={() => setOpen(false)}>
													{t(item.title, { defaultValue: item.title })}
												</Link>
											</CommandItem>
										))}
									</CommandGroup>
								</Fragment>
							) : (
								filteredItems.length > 0 && (
									<CommandGroup heading={`${filteredItems.length} results`}>
										{filteredItems.map((item) => (
											<CommandItem key={item.hash} className='h-8 text-sm' value={item.hash} asChild>
												<Link hash={item.hash} onClick={() => setOpen(false)}>
													{t(item.title, { defaultValue: item.title })}
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
