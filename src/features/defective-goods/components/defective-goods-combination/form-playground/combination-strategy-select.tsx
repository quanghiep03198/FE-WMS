import { Div } from '@components/customs/div'
import { Icon } from '@components/ui/icon'
import { Label } from '@components/ui/label'
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { CombinationStrategy } from '@features/defective-goods/constants/enums'
import { capitalize } from 'lodash-es'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useSwitchCombinationStrategy } from '../../../hooks/use-switch-combination-strategy'

const CombinationStrategySelect: React.FC<{ disabled: boolean }> = ({ disabled }) => {
	const { currentStrategy, setStrategy } = useSwitchCombinationStrategy()
	const { t } = useTranslation()

	return (
		<Div className='ml-auto w-auto'>
			<RadioGroup
				className='hidden items-center gap-x-6 @2xl/combination-form:flex [&>div[role=radiogroup]]:inline-flex [&>div[role=radiogroup]]:items-center [&>div[role=radiogroup]]:gap-x-2'
				disabled={disabled}
				value={currentStrategy}
				onValueChange={(value: CombinationStrategy) => setStrategy(value)}>
				<Div role='radiogroup'>
					<RadioGroupItem disabled={disabled} id='uhf-device-strategy' value={CombinationStrategy.UHF} />
					<RadioGroupLabel aria-disabled={disabled} htmlFor='uhf-device-strategy'>
						UHF <Icon name='Router' size={18} />
					</RadioGroupLabel>
				</Div>
				<Div role='radiogroup'>
					<RadioGroupItem id='usb-strategy' value={CombinationStrategy.USB} />
					<RadioGroupLabel aria-disabled={disabled} htmlFor='usb-strategy'>
						USB <Icon name='Usb' size={18} />
					</RadioGroupLabel>
				</Div>
				<Div role='radiogroup'>
					<RadioGroupItem id='manually-strategy' value={CombinationStrategy.MANUALLY} />
					<RadioGroupLabel aria-disabled={disabled} htmlFor='manually-strategy'>
						{t('ns_common:titles.manually')} <Icon name='Keyboard' size={18} />
					</RadioGroupLabel>
				</Div>
			</RadioGroup>
			<Select
				disabled={disabled}
				value={typeof currentStrategy === 'string' ? currentStrategy : undefined}
				onValueChange={(value) => setStrategy(value as CombinationStrategy)}>
				<SelectTrigger className='flex w-32 @2xl/combination-form:hidden'>
					<SelectValue placeholder={capitalize(t('ns_erp:fields.combination_strategy'))} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={CombinationStrategy.UHF}>
						<Div className='flex items-center gap-x-2'>
							<Icon name='Router' /> UHF
						</Div>
					</SelectItem>
					<SelectItem value={CombinationStrategy.USB}>
						<Div className='flex items-center gap-x-2'>
							<Icon name='Usb' /> USB
						</Div>
					</SelectItem>
					<SelectItem value={CombinationStrategy.MANUALLY}>
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
