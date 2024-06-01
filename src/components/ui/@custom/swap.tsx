import { forwardRef, useId, useRef } from 'react';
import tw from 'tailwind-styled-components';
import { Button } from '..';

type TSwapButtonProps = React.ClassAttributes<HTMLLabelElement> &
	React.LabelHTMLAttributes<HTMLLabelElement> & {
		checked?: boolean;
		onChange?: React.ChangeEventHandler<HTMLInputElement>;
		swapOn: React.ReactNode;
		swapOff: React.ReactNode;
	};

export const Swap = forwardRef<React.Ref<HTMLInputElement>, TSwapButtonProps>(({ checked, swapOn, swapOff, onChange, ...rest }: TSwapButtonProps, ref) => {
	const id = useId();
	const localRef = useRef(null);
	const resolvedRef = (ref || localRef) as React.MutableRefObject<any>;

	return (
		<Label htmlFor={id} {...rest}>
			<Toggler
				id={id}
				type='checkbox'
				checked={checked}
				ref={resolvedRef}
				onChange={(e) => {
					if (onChange) onChange(e);
				}}
			/>
			<SwapLabel className='opacity-0 peer-checked:-rotate-45 peer-checked:opacity-100 peer-indeterminate:opacity-0'>{swapOn}</SwapLabel>
			<SwapLabel className='opacity-100 peer-checked:-rotate-45 peer-checked:opacity-0'>{swapOff}</SwapLabel>
		</Label>
	);
});
const Label = tw.label`
	inline-grid 
	items-center
	justify-center
	whitespace-nowrap
	rounded-md
	text-sm
	font-medium
	focus-visible:outline-none
	focus-visible:ring-1
	focus-visible:ring-ring
	disabled:pointer-events-none
	disabled:opacity-50
	place-content-center
	cursor-pointer
	relative
	select-none
	padding-1
	hover:bg-accent
	hover:text-accent-foreground
	h-9 w-9


`;

const Toggler = tw.input`
	peer
	appearance-none
	absolute
	inset-0
`;
const SwapLabel = tw.div`
	cursor-pointer
	select-none
	text-base
	row-start-1
	col-start-1
	align-middle
	transition-all 
	duration-300
`;
