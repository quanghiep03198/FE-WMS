import { Input } from '@components/ui/input'
import { useDebounceEffect } from 'ahooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFilterQuery } from '../../../hooks/use-filter-query'
import { useInoutboundMethod } from '../../../hooks/use-select-inoutbound-method'

const QuantityFiledControl = () => {
	const { t } = useTranslation()
	const { searchParams, setParams, removeParam } = useFilterQuery()
	const [currentInoutboundMethod] = useInoutboundMethod()

	const [currentValue, setCurrentValue] = useState<number>(searchParams.take || null)

	useDebounceEffect(
		() => {
			if (currentValue > 0) setParams({ ...searchParams, take: currentValue })
			else removeParam('take')
		},
		[currentValue],
		{ wait: 200 }
	)

	if (currentInoutboundMethod !== 'manually') return null

	return (
		<Input
			min={1}
			name='qty'
			placeholder={t('ns_common:common_fields.quantity')}
			type='number'
			value={currentValue || null}
			onChange={(e) => setCurrentValue(+e.currentTarget.value)}
		/>
	)
}

export default QuantityFiledControl
