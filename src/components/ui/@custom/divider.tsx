import type { PropsWithChildren } from 'react'

export const Divider: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className='relative'>
			<div className='absolute inset-0 flex items-center' aria-hidden='true'>
				<div className='w-full border-t' />
			</div>
			<div className='relative flex justify-center text-sm leading-6 font-medium'>
				<span className='bg-background text-muted-foreground px-6 text-xs uppercase'>{children}</span>
			</div>
		</div>
	)
}
