import * as React from 'react'

import { cn } from '@common/utils/cn'

const Table: React.FC<React.ComponentProps<'table'>> = ({ className, ...props }) => (
	<table
		cellSpacing={0}
		className={cn('w-full caption-bottom border-separate border-spacing-0 text-sm', className)}
		{...props}
	/>
)

Table.displayName = 'Table'

const TableHeader: React.FC<React.ComponentProps<'thead'>> = ({ className, ...props }) => (
	<thead className={cn('[&>tr>th:first-child]:border-l-0', className)} {...props} />
)
TableHeader.displayName = 'TableHeader'

const TableBody: React.FC<React.ComponentProps<'tbody'>> = ({ className, ...props }) => (
	<tbody className={cn('[&>tr]:last:border-b-0 [&>tr>td:first-child]:border-l-0', className)} {...props} />
)

TableBody.displayName = 'TableBody'

const TableFooter: React.FC<React.ComponentProps<'tfoot'>> = ({ className, ...props }) => (
	<tfoot className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)} {...props} />
)

TableFooter.displayName = 'TableFooter'

const TableRow: React.FC<React.ComponentProps<'tr'>> = ({ className, ...props }) => (
	<tr
		className={cn(
			'[&:has(td[aria-disabled=true])_td]:bg-muted [&:has(td[aria-disabled=true])_td]:text-muted-foreground *:border-b *:border-l [&:last-child>td]:border-b-0 [&>*:first-child]:border-l-0',
			className
		)}
		{...props}
	/>
)

TableRow.displayName = 'TableRow'

const TableHead: React.FC<React.ComponentProps<'th'>> = ({ className, ...props }) => (
	<th
		className={cn(
			'bg-background text-table-head-foreground group-hover:bg-secondary/50 w-full px-4 py-2 font-semibold has-[[role=button]]:text-center has-[[role=checkbox]]:text-center has-[[role=combobox]]:p-0 has-[[role=listbox]]:p-0 has-[[role=textbox]]:p-0 data-[type=number]:text-right',
			className
		)}
		{...props}
	/>
)

TableHead.displayName = 'TableHead'

const TableCell: React.FC<React.ComponentProps<'td'>> = ({ className, ...props }) => (
	<td
		className={cn(
			'bg-background group-hover:bg-table-row-active group-aria-expanded:bg-table-row-active group-aria-selected:bg-table-row-selected data-[disabled=true]:bg-muted px-4 py-2 first:border-l-0 last:border-r-0 has-[[role=button]]:text-center has-[[role=checkbox]]:text-center has-[[role=combobox]]:p-0 has-[[role=listbox]]:p-0 has-[[role=textbox]]:p-0 data-[type=number]:text-right',
			className
		)}
		{...props}
	/>
)
TableCell.displayName = 'TableCell'

const TableCaption: React.FC<React.ComponentProps<'tfoot'>> = ({ className, ...props }) => (
	<caption className={cn('text-muted-foreground mt-4 text-sm', className)} {...props} />
)

TableCaption.displayName = 'TableCaption'

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow }
