'use no memo'

import { Input } from '@components/ui/input'
import { CombinationStrategy } from '@features/defective-goods/constants/enums'
import { useDebounceEffect, useResetState } from 'ahooks'
import { Activity, useEffect, useImperativeHandle, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useFilterQuery } from '../../../hooks/use-filter-query'
import { useInoutboundMethod } from '../../../hooks/use-select-inoutbound-method'

const QuantityFiledControl: React.FC<{ ref: React.Ref<{ reset: () => void }> }> = ({ ref }) => {
	const { t } = useTranslation()
	const { searchParams, setParams, removeParam } = useFilterQuery()
	const [currentInoutboundMethod] = useInoutboundMethod()
	const inputRef = useRef<HTMLInputElement>(document.createElement('input'))
	const [currentValue, setCurrentValue, resetCurrentValue] = useResetState<Nullish<number>>(searchParams.take ?? 0)

	useDebounceEffect(
		() => {
			if (typeof currentValue === 'number' && currentValue > 0) setParams({ ...searchParams, take: currentValue })
			else removeParam('take')
		},
		[currentValue],
		{ wait: 200 }
	)

	useImperativeHandle(
		ref,
		() => ({
			reset: () => {
				resetCurrentValue()
				if (inputRef.current) inputRef.current.value = ''
			}
		}),
		[inputRef.current]
	)

	useEffect(() => {
		resetCurrentValue()
		if (inputRef.current) inputRef.current.value = ''
	}, [currentInoutboundMethod])

	return (
		<Activity mode={currentInoutboundMethod !== CombinationStrategy.MANUALLY ? 'hidden' : 'visible'}>
			<Input
				className='shadow-xs'
				min={1}
				name='qty'
				placeholder={t('ns_common:common_fields.quantity')}
				ref={inputRef}
				type='number'
				value={currentValue!}
				onChange={(e) => setCurrentValue(+e.currentTarget.value)}
			/>
		</Activity>
	)
}

export default QuantityFiledControl
