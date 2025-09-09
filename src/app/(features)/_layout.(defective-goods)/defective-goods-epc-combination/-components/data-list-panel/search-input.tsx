import useQueryParams from '@/common/hooks/use-query-params'
import { Div, Icon, Input } from '@/components/ui'
import { useDebounceEffect, useResetState } from 'ahooks'

const SearchInput: React.FC = () => {
	const { searchParams, setParams } = useQueryParams<{ page: number; q?: string }>()
	const [value, setValue, resetValue] = useResetState<string>(searchParams.q ?? '')

	const handleEpcChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		// if (e.currentTarget.value.length >= 24) {
		// 	return
		// }
		setValue(e.currentTarget.value.toUpperCase())
	}

	useDebounceEffect(
		() => {
			setParams({ ...searchParams, q: value })
		},
		[value],
		{ wait: 200 }
	)

	return (
		<Div className='flex h-9 items-center space-x-2 overflow-clip rounded-md border px-2 focus-within:border-primary'>
			<Icon name='Search' />
			<Input
				placeholder='Scan EPC to search specific item ...'
				className='border-none px-0 shadow-none'
				type='search'
				value={value}
				onChange={handleEpcChange}
				onKeyDown={(e) => {
					if (e.key === 'Backspace') resetValue()
				}}
			/>
		</Div>
	)
}

export default SearchInput
