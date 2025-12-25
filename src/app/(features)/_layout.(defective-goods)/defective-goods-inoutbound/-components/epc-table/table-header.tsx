import { TableHead, TableHeader, TableRow } from '@/components/ui'
import { DebouncedInput } from '@/components/ui/@react-table/components/debounced-input'
import { IDefectiveGoods } from '@/services/defective-goods.service'
import { flexRender, HeaderGroup } from '@tanstack/react-table'
import { Fragment, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useFilterQuery } from '../../-hooks/use-filter-query'

export const DataTableHeader: React.FC<{ headerGroups: HeaderGroup<IDefectiveGoods>[] }> = ({ headerGroups }) => {
	const { t } = useTranslation()
	const { searchParams, setParams } = useFilterQuery()

	return (
		<TableHeader className='sticky top-0 z-50 bg-background'>
			{headerGroups.map((headerGroup) => (
				<Fragment key={headerGroup.id}>
					<TableRow className='border-b'>
						{headerGroup.headers.map((header) => {
							const { columnDef } = header.column
							return (
								<TableHead
									key={header.id}
									colSpan={header.colSpan}
									className='border-b bg-table-head text-table-head-foreground'
									style={{ width: header.getSize() }}
									align={columnDef.meta?.align}>
									{header.isPlaceholder ? null : (
										<span className='line-clamp-1 text-left text-sm text-inherit'>
											{flexRender(columnDef.header, header.getContext())}
										</span>
									)}
								</TableHead>
							)
						})}
					</TableRow>
					<TableRow className='border-b'>
						{headerGroup.headers.map((header) => {
							const { columnDef } = header.column

							return (
								<TableHead
									key={header.id}
									style={{ width: header.getSize(), padding: 0 }}
									align={columnDef.meta?.align}>
									<DebouncedInput
										value={searchParams[header.id]}
										onChange={(value) => setParams({ ...searchParams, [header.id]: value })}
										placeholder={t('ns_common:actions.search') + '...'}
									/>
								</TableHead>
							)
						})}
					</TableRow>
				</Fragment>
			))}
		</TableHeader>
	)
}

export const MemoizedDataTableHeader = memo(DataTableHeader)
