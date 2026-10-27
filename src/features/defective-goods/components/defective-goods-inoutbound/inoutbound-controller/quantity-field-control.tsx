'use no memo'

import { Input } from '@components/ui/input'
import { useDebounceEffect, useResetState } from 'ahooks'
import { useImperativeHandle, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useFilterQuery } from '../../../hooks/use-filter-query'
import { useInoutboundMethod } from '../../../hooks/use-select-inoutbound-method'

const QuantityFiledControl: React.FC<{ ref: React.Ref<{ reset: () => void }> }> = ({ ref }) => {
	const { t } = useTranslation()
	const { searchParams, setParams, removeParam } = useFilterQuery()
	const [currentInoutboundMethod] = useInoutboundMethod()
	const inputRef = useRef<HTMLInputElement>(null)
	const [currentValue, setCurrentValue, resetCurrentValue] = useResetState<Nullish<number>>(searchParams.take)

	useDebounceEffect(
		() => {
			if (typeof currentValue === 'number' && currentValue > 0) setParams({ ...searchParams, take: currentValue })
			else removeParam('take')
		},
		[currentValue],
		{ wait: 200 }
	)

	useImperativeHandle(ref, () => ({ reset: () => resetCurrentValue() }), [searchParams.take])

	if (currentInoutboundMethod !== 'manually') return null

	return (
		<Input
			min={1}
			name='qty'
			placeholder={t('ns_common:common_fields.quantity')}
			ref={inputRef}
			type='number'
			value={currentValue!}
			onChange={(e) => setCurrentValue(+e.currentTarget.value)}
		/>
	)
}

export default QuantityFiledControl
