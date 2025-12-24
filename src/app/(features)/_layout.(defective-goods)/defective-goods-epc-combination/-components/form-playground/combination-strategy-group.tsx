import { cn } from '@/common/utils/cn'
import { Div, Icon, Label, RadioGroup, RadioGroupItem } from '@/components/ui'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSwitchCombinationStrategy } from '../../../-hooks/use-switch-combination-strategy'

const CombinationStrategyRadioGroup: React.FC<{ shouldNotAllowUhf: boolean }> = ({ shouldNotAllowUhf }) => {
	const { currentStrategy, setStrategy } = useSwitchCombinationStrategy()
	const { t } = useTranslation()

	return (
		<RadioGroup
			value={currentStrategy}
			onValueChange={(value: 'usb' | 'uhf' | 'manually') => setStrategy(value)}
			className='flex items-center gap-x-6'>
			<Div className='flex items-center gap-3'>
				<RadioGroupItem value='uhf' id='uhf-device-strategy' disabled={shouldNotAllowUhf} />
				<Label
					htmlFor='uhf-device-strategy'
					className={cn('inline-flex items-center gap-x-2', shouldNotAllowUhf && 'text-muted-foreground')}>
					UHF <Icon name='Router' size={18} />
				</Label>
			</Div>
			<Div className='flex items-center gap-3'>
				<RadioGroupItem value='usb' id='usb-strategy' />
				<Label htmlFor='usb-strategy' className='inline-flex items-center gap-x-2'>
					USB <Icon name='Usb' size={18} />
				</Label>
			</Div>
			<Div className='flex items-center gap-3'>
				<RadioGroupItem value='manually' id='manually-strategy' />
				<Label htmlFor='manually-strategy' className='inline-flex items-center gap-x-2'>
					{t('ns_common:titles.manually')} <Icon name='Keyboard' size={18} />
				</Label>
			</Div>
		</RadioGroup>
	)
}

export default memo(CombinationStrategyRadioGroup)
