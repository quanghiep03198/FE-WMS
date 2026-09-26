import tw from 'tailwind-styled-components'

export const NestedTable: React.FC<React.ComponentProps<'div'>> =
	tw.div`flex grow border-collapse flex-nowrap *:not-first:border-l`
export const NestedColumn: React.FC<React.ComponentProps<'div'>> =
	tw.div`group/cell inline-grid min-w-24 shrink-0 basis-24 grid-rows-2 divide-y last:flex-1`
export const NestedCellHead: React.FC<React.ComponentProps<'div'>> =
	tw.div`font-medium bg-table-head text-table-head-foreground px-4 py-2 first:border-l-0 last:border-r-0 group-hover:bg-table-row-active aria-selected:bg-table-row-selected data-[disabled=true]:bg-muted data-[type=number]:text-right has-[[role=textbox]]:p-0`
export const NestedCell: React.FC<React.ComponentProps<'div'>> =
	tw.div`bg-background px-4 py-2 first:border-l-0 last:border-r-0 group-hover:bg-table-row-active aria-selected:bg-table-row-selected data-[disabled=true]:bg-muted data-[type=number]:text-right has-[[role=textbox]]:p-0`
