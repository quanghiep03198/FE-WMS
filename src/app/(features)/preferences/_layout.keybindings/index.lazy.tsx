import { NavigationConfig, navigationConfig } from '@/app/(features)/-configs/navigation.config'
import { Badge, Div, Icon, Separator } from '@/components/ui'
import { DebouncedInput } from '@/components/ui/@custom/debounced-input'
import DataTable from '@/components/ui/@react-table'
import { fuzzySort } from '@/components/ui/@react-table/utils/fuzzy-sort.util'
import { createLazyFileRoute } from '@tanstack/react-router'
import { createColumnHelper, Table } from '@tanstack/react-table'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../../-components/shared/page-header'

type CommandList = Pick<NavigationConfig, 'title' | 'keybinding'>[]

export const Route = createLazyFileRoute('/(features)/preferences/_layout/keybindings/')({
	component: KeybindingsPage
})

function KeybindingsPage() {
	const { t } = useTranslation<'ns_common', undefined>('ns_common')

	const navigationCommands = Object.values(navigationConfig)
		.flat()
		.filter((item) => !!item.keybinding)
		.map((item, index) => ({
			id: String(index + 1),
			title: t(item.title, { defaultValue: item.title }),
			keybinding: String(item.keybinding).split('.').join(' + ')
		}))
		.concat() as CommandList

	const extendedCommands = [
		{
			title: t('actions.search', { defaultValue: null }),
			keybinding: 'ctrl + k'
		},
		{
			title: t('actions.toggle_theme', { defaultValue: null }),
			keybinding: 'ctrl + alt + t'
		},
		{
			title: t('actions.toggle_sidebar', { defaultValue: null }),
			keybinding: 'ctrl + b'
		},
		{
			title: t('actions.logout', { defaultValue: null }),
			keybinding: 'ctrl + q'
		}
	].map((item, index) => ({
		...item,
		id: String(Object.values(navigationConfig).flat().length + index + 1)
	})) as CommandList

	const columnHelper = createColumnHelper<Pick<NavigationConfig, 'title' | 'keybinding'>>()

	const columns = [
		columnHelper.accessor('title', {
			header: t('ns_common:settings.function'),
			enableSorting: true,
			enableColumnFilter: true,
			enableResizing: false,
			filterFn: 'fuzzy',
			sortingFn: fuzzySort,
			minSize: 200
		}),
		columnHelper.accessor('keybinding', {
			header: t('ns_common:navigation.keyboard_shortcut'),
			enableSorting: true,
			enableColumnFilter: true,
			enableResizing: false,
			filterFn: 'fuzzy',
			sortingFn: fuzzySort,
			minSize: 300,
			cell: ({ getValue }) => (
				<Badge variant='secondary'>
					<kbd>{getValue()}</kbd>
				</Badge>
			)
		})
	]

	return (
		<Fragment>
			<title>{t('ns_common:navigation.keyboard_shortcut')}</title>
			<meta name='description' content={t('ns_preference:captions.keybindings')} />

			<Div className='space-y-6'>
				<PageHeader>
					<PageTitle>{t('ns_common:navigation.keyboard_shortcut')}</PageTitle>
					<PageDescription>{t('ns_preference:captions.keybindings')}</PageDescription>
				</PageHeader>
				<Separator />
				<DataTable
					data={navigationCommands.concat(extendedCommands)}
					columns={columns}
					border='bottom-only'
					initialState={{
						pagination: {
							pageSize: 50,
							pageIndex: 0
						}
					}}
					enableColumnResizing
					containerProps={{ className: 'h-[50vh]' }}
					toolbarProps={{
						override: true,
						render: ({ table }: { table: Table<Pick<NavigationConfig, 'title' | 'keybinding'>> }) => (
							<Div className='flex h-10 w-1/3 items-center gap-x-2 self-end overflow-hidden rounded-md border px-4 py-2'>
								<Icon name='Search' />
								<DebouncedInput
									value={table.getState().globalFilter}
									onChange={(value) => table.setGlobalFilter(value)}
									placeholder={t('ns_common:actions.search') + '...'}
									className='p-0'
								/>
							</Div>
						)
					}}
				/>
			</Div>
		</Fragment>
	)
}
