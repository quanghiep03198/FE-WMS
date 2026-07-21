import { Div, Input, Label } from '@/components/ui'
import { useDebounceEffect } from 'ahooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { StockFlow } from '../../constants/enums'
import { usePersistentFilterState } from '../../hooks/use-persistent-filter-state'

const DebouncedLimitInput: React.FC<{ dataType: StockFlow }> = ({ dataType }) => {
	const { t } = useTranslation()
	const [persistentFormValues, setPersistentFormValues] = usePersistentFilterState(dataType)
	const [value, setValue] = useState<number>(persistentFormValues.limit)

	useDebounceEffect(
		() => {
			setPersistentFormValues({ ...persistentFormValues, limit: +value })
		},
		[value],
		{ wait: 300, leading: true, trailing: true }
	)

	return (
		<Div className='flex basis-1/2 items-center gap-x-3'>
			<Label className='whitespace-nowrap'>{t('ns_common:table.rows_per_page')}</Label>
			<Input
				type='number'
				placeholder='10'
				value={value || ''}
				min={10}
				step={10}
				aria-invalid={value <= 0}
				className='aria-invalid:border-destructive h-8 w-16 text-center'
				onChange={(e) => {
					const val = e.currentTarget.value
					const formatted = val.replace(/[^0-9]/g, '')
					setValue(+formatted)
				}}
			/>
		</Div>
	)
}

export default DebouncedLimitInput
