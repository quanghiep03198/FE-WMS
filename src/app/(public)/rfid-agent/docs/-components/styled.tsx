import tw from 'tailwind-styled-components'

export const Section: React.FC<React.ComponentProps<'section'>> = tw.section`space-y-3`
export const UnorderedList: React.FC<React.ComponentProps<'ul'>> = tw.ul`list-inside list-disc space-y-2 pl-4`
export const ListItem: React.FC<React.ComponentProps<'li'>> = tw.li`text-base leading-relaxed`
export const OrderedList: React.FC<React.ComponentProps<'ol'>> = tw.ol`list-inside list-decimal space-y-2 pl-4`
