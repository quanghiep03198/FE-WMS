import {
	Div,
	Icon,
	Label,
	RadioGroup,
	RadioGroupItem,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui'
import { capitalize } from 'lodash-es'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useSwitchCombinationStrategy } from '../../../-hooks/use-switch-combination-strategy'

const CombinationStrategySelect: React.FC<{ disabled: boolean }> = ({ disabled }) => {
	const { currentStrategy, setStrategy } = useSwitchCombinationStrategy()
	const { t } = useTranslation()

	return (
		<Div className='ml-auto w-auto'>
			<RadioGroup
				disabled={disabled}
				value={currentStrategy}
				onValueChange={(value: 'usb' | 'uhf' | 'manually') => setStrategy(value)}
				className='hidden items-center gap-x-6 @2xl/combination-form:flex [&>div[role=radiogroup]]:inline-flex [&>div[role=radiogroup]]:items-center [&>div[role=radiogroup]]:gap-x-2'>
				<Div role='radiogroup'>
					<RadioGroupItem value='uhf' id='uhf-device-strategy' disabled={disabled} />
					<RadioGroupLabel htmlFor='uhf-device-strategy' aria-disabled={disabled}>
						UHF <Icon name='Router' size={18} />
					</RadioGroupLabel>
				</Div>
				<Div role='radiogroup'>
					<RadioGroupItem value='usb' id='usb-strategy' />
					<RadioGroupLabel htmlFor='usb-strategy' aria-disabled={disabled}>
						USB <Icon name='Usb' size={18} />
					</RadioGroupLabel>
				</Div>
				<Div role='radiogroup'>
					<RadioGroupItem value='manually' id='manually-strategy' />
					<RadioGroupLabel htmlFor='manually-strategy' aria-disabled={disabled}>
						{t('ns_common:titles.manually')} <Icon name='Keyboard' size={18} />
					</RadioGroupLabel>
				</Div>
			</RadioGroup>
			<Select
				disabled={disabled}
				value={currentStrategy}
				onValueChange={(value) => setStrategy(value as 'usb' | 'uhf' | 'manually')}>
				<SelectTrigger className='flex w-32 @2xl/combination-form:hidden'>
					<SelectValue placeholder={capitalize(t('ns_erp:fields.ri_type'))} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='uhf'>
						<Div className='flex items-center gap-x-2'>
							<Icon name='Router' /> UHF
						</Div>
					</SelectItem>
					<SelectItem value='usb'>
						<Div className='flex items-center gap-x-2'>
							<Icon name='Usb' /> USB
						</Div>
					</SelectItem>
					<SelectItem value='manually'>
						<Div className='flex items-center gap-x-2'>
							<Icon name='Keyboard' />
							{t('ns_common:titles.manually')}
						</Div>
					</SelectItem>
				</SelectContent>
			</Select>
		</Div>
	)
}

const RadioGroupLabel = tw(Label)<
	React.ComponentProps<typeof Label>
>`inline-flex items-center gap-x-2 aria-disabled:text-muted-foreground`

export default memo(CombinationStrategySelect)
