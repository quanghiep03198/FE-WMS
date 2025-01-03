import { cn } from '@/common/utils/cn'
import { useEffect, useState } from 'react'
import { Input } from '../..'

type DebouncedInputProps = {
	value: string | number
	onChange: (value: string | number) => void
	debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>

export const DebouncedInput: React.FC<DebouncedInputProps> = ({
	value,
	onChange,
	debounce = 200,
	className,
	...props
}) => {
	const [_value, setValue] = useState(value)

	useEffect(() => {
		setValue(value)
	}, [value])

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(_value)
		}, debounce)

		return () => clearTimeout(timeout)
	}, [_value])

	return (
		<Input
			{...props}
			value={_value}
			onChange={(e) => setValue(e.target.value)}
			className={cn(
				'border-none shadow-none outline-none ring-0 ring-offset-transparent duration-0 placeholder:text-xs',
				className
			)}
		/>
	)
}
