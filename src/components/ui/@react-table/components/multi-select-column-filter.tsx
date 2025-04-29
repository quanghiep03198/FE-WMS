import { sortedUniqBy } from 'lodash'
import { useMemo, useState } from 'react'
import { MultiSelect, MultiSelectProps } from '../../@custom/multi-select'

function MultiSelectColumnFilter<TData extends Record<'label' | 'value', string>>({
	datalist,
	value,
	onValueChange
}: Pick<MultiSelectProps<TData>, 'datalist' | 'value' | 'onValueChange'>) {
	const [searchTerm, setSearchTerm] = useState<string>('')
	console.log(value)
	const filteredDataList = useMemo(() => {
		if (!Array.isArray(datalist)) return []
		const result = datalist.filter((item) =>
			item.value.trim().toLowerCase().includes(searchTerm.trim().toLowerCase())
		)
		return sortedUniqBy([...result, ...value.map((item) => ({ label: item, value: item }))], 'value')
	}, [datalist, searchTerm])

	return (
		<MultiSelect
			value={value}
			datalist={filteredDataList as TData[]}
			shouldFilter={false}
			labelField='label'
			valueField='value'
			onInput={(search) => setSearchTerm(search)}
			onValueChange={(value) => onValueChange(value)}
			className='h-10 border-none shadow-none'
		/>
	)
}

export default MultiSelectColumnFilter
