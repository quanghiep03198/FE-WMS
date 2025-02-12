import * as React from 'react'

import { cn } from '@/common/utils/cn'

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
	({ className, ...props }, ref) => (
		<table
			cellSpacing={0}
			ref={ref}
			className={cn('w-full caption-bottom border-collapse text-sm', className)}
			{...props}
		/>
	)
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => (
		<thead ref={ref} className={cn('whitespace-nowrap [&>tr>th:first-child]:border-l-0', className)} {...props} />
	)
)
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => (
		<tbody
			ref={ref}
			className={cn('[&>tr>td:first-child]:border-l-0 [&>tr]:last:border-b-0', className)}
			{...props}
		/>
	)
)
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => (
		<tfoot
			ref={ref}
			className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
			{...props}
		/>
	)
)
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
	({ className, ...props }, ref) => (
		<tr
			ref={ref}
			className={cn(
				'[&:has([aria-disabled=true])_td]:bg-muted [&:has([aria-disabled=true])_td]:text-muted-foreground [&:last-child>td]:border-b-0 [&>*]:border-b [&>*]:border-l',
				className
			)}
			{...props}
		/>
	)
)
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
	({ className, ...props }, ref) => (
		<th
			ref={ref}
			style={{ position: 'inherit' }}
			className={cn(
				'w-full bg-background px-4 py-2 font-semibold text-muted-foreground group-hover:bg-secondary/50',
				className
			)}
			{...props}
		/>
	)
)
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
	({ className, ...props }, ref) => (
		<td
			ref={ref}
			className={cn(
				'bg-background px-4 py-2 first:border-l-0 last:border-r-0 group-hover:bg-table-row-active aria-selected:bg-table-row-selected data-[disabled=true]:bg-muted data-[type=number]:text-right [&:has([role=button])]:text-center [&:has([role=checkbox])]:text-center [&:has([role=combobox])]:p-0 [&:has([role=listbox])]:p-0 [&:has([role=textbox])]:p-0',
				className
			)}
			{...props}
		/>
	)
)
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
	({ className, ...props }, ref) => (
		<caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
	)
)
TableCaption.displayName = 'TableCaption'

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow }
