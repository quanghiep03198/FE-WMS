import tw from 'tailwind-styled-components'

export const GhostButton: React.FC<React.ComponentProps<'button'>> =
	tw.button`text-muted-foreground transition-colors duration-200 hover:text-foreground flex items-center relative justify-center disabled:opacity-50 disabled:hover:text-muted-foreground disabled:text-muted-foreground`
