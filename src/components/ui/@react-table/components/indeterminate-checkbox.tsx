import { useEffect, useRef } from 'react'
import tw from 'tailwind-styled-components'

export function IndeterminateCheckbox({
	indeterminate,
	...rest
}: { indeterminate?: boolean } & React.HTMLProps<HTMLInputElement>) {
	const ref = useRef<HTMLInputElement>(null!)

	useEffect(() => {
		if (typeof indeterminate === 'boolean') {
			ref.current.indeterminate = !rest.checked && indeterminate
		}
	}, [ref, indeterminate])

	return <Input type='checkbox' role='checkbox' ref={ref} {...rest} />
}

const Input = tw.input`size-4 cursor-pointer rounded border text-primary outline-none ring-0 ring-offset-0 ring-offset-transparent ring-transparent`
