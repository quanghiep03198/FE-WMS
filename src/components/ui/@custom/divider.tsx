import { PropsWithChildren } from 'react';

export const Divider: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className='relative'>
			<div className='absolute inset-0 flex items-center' aria-hidden='true'>
				<div className='w-full border-t' />
			</div>
			<div className='relative flex justify-center text-sm font-medium leading-6'>
				<span className='bg-background px-6 text-xs uppercase text-muted-foreground'>{children}</span>
			</div>
		</div>
	);
};
