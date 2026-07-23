import { Div, Icon, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui'
import { capitalize } from 'lodash-es'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useInoutboundMethod } from '../../../hooks/use-select-inoutbound-method'

const InoutboundStrategySelect: React.FC = () => {
	const { t } = useTranslation()
	const [inoutboundMethod, setInoutboundMethod] = useInoutboundMethod()

	return (
		<Select defaultValue='manually' value={inoutboundMethod} onValueChange={setInoutboundMethod}>
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
				<SelectItem value='manually'>
					<Div className='flex items-center gap-x-2'>
						<Icon name='Keyboard' /> {t('ns_common:titles.manually')}
					</Div>
				</SelectItem>
			</SelectContent>
		</Select>
	)
}

export default InoutboundStrategySelect
