import ScrollShadow, { ScrollShadowProps } from '@/components/ui/@custom/scroll-shadow'
import tw from 'tailwind-styled-components'

export const FilterForm = tw.form`grid gap-6 auto-rows-min`
export const SheetBody = tw.div`flex flex-col flex-grow flex-1 gap-y-6 w-full h-[calc(100vh-280px)]`
export const ListContainer = tw.div`space-y-2`
export const ListHeader = tw.div`grid grid-cols-[10%_50%_20%_20%] mr-[10px] [&>:first-child]:place-self-center [&>:last-child]:place-self-center items-center gap-x-2 px-2 py-4 border-b`
export const ListItem = tw.label`grid grid-cols-[10%_50%_20%_20%] [&>:first-child]:place-self-center [&>:last-child]:place-self-center items-center gap-x-2 p-2 cursor-pointer hover:bg-accent/50 hover:text-accent-foreground inset-x-0 rounded-md font-medium aria-selected:bg-accent`
export const ListBody = tw(ScrollShadow)<ScrollShadowProps>`xxl:h-[50vh] h-[40vh] space-y-1 !scroll-auto`
export const ListDetail = tw.ul`flex list-inside list-disc flex-col items-stretch gap-y-2`
export const ListDetailItem = tw.li`[&>small]:font-medium`
export const GhostButton = tw.button`text-muted-foreground transition-colors duration-200 hover:text-foreground flex items-center relative justify-center`
