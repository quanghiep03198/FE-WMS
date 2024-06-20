import * as React from 'react'

import { cn } from '@/common/utils/cn'

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
	({ className, ...props }, ref) => (
		<table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
	)
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => (
		<thead
			ref={ref}
			className={cn(
				'sticky h-10 whitespace-nowrap data-[sticky=left]:left-0 data-[sticky=right]:right-0 data-[sticky=left]:z-10 data-[sticky=right]:z-10 [&_tr]:border-b',
				className
			)}
			{...props}
		/>
	)
)
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => <tbody ref={ref} className={cn('divide-y divide-border', className)} {...props} />
)
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => (
		<tfoot
			ref={ref}
			className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0 ', className)}
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
				'[&:has([aria-disabled=true])_td]:bg-muted [&:has([aria-disabled=true])_td]:text-muted-foreground [&_td]:border-b [&_th]:border-b ',
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
				'w-full bg-background px-4 font-semibold text-muted-foreground group-hover:bg-secondary/20 data-[sticky=left]:!sticky data-[sticky=right]:!sticky data-[sticky=left]:left-0 data-[sticky=right]:right-0 data-[sticky=left]:z-10 data-[sticky=right]:z-10',
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
				'bg-background px-4 py-2 align-middle text-sm group-hover:bg-secondary data-[sticky=left]:sticky data-[sticky=right]:sticky data-[sticky=left]:left-0 data-[sticky=right]:right-0 data-[sticky=left]:z-10 data-[sticky=right]:z-10 data-[disabled=true]:bg-muted data-[state=selected]:bg-accent [&:has([role=checkbox])]:pr-0',
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

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
