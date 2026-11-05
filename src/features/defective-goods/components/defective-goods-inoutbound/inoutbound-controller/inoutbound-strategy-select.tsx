import { Div } from '@components/customs/div'
import { Icon } from '@components/ui/icon'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { CombinationStrategy } from '@features/defective-goods/constants/enums'
import { useFilterQuery } from '@features/defective-goods/hooks/use-filter-query'
import { capitalize } from 'lodash-es'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useInoutboundMethod } from '../../../hooks/use-select-inoutbound-method'

const InoutboundStrategySelect: React.FC = () => {
	const { t } = useTranslation()
	const [inoutboundMethod, setInoutboundMethod] = useInoutboundMethod()
	const { removeParam } = useFilterQuery()

	return (
		<Select
			defaultValue={CombinationStrategy.MANUALLY}
			value={inoutboundMethod}
			onValueChange={(value) => {
				setInoutboundMethod(value)
				if (value !== CombinationStrategy.MANUALLY) removeParam('take')
			}}>
			<SelectTrigger className='flex w-40 items-center'>
				<SelectValue
					placeholder={capitalize(
						t('ns_common:form_placeholder.select', {
							object: t('ns_inoutbound:labels.inoutbound_method'),
							defaultValue: 'Select In/Outbound Method'
						})
					)}
				/>
			</SelectTrigger>
			<SelectContent>
				<SelectItem value='rfid'>
					<Div className='flex items-center gap-x-2'>
						<Icon name='Router' /> RFID
					</Div>
				</SelectItem>
				<SelectItem value={CombinationStrategy.MANUALLY}>
					<Div className='flex items-center gap-x-2'>
						<Icon name='Keyboard' /> {t('ns_common:titles.manually')}
					</Div>
				</SelectItem>
			</SelectContent>
		</Select>
	)
}

export default InoutboundStrategySelect
