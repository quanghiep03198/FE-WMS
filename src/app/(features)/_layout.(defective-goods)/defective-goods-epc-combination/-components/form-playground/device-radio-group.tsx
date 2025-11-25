import { cn } from '@/common/utils/cn'
import { Div, Icon, Label, RadioGroup, RadioGroupItem } from '@/components/ui'
import { memo } from 'react'
import { useSwitchRFIDDevice } from '../../../-hooks/use-switch-rfid-device'

const DeviceRadioGroup: React.FC<{ shouldNotAllowUhf: boolean }> = ({ shouldNotAllowUhf }) => {
	const { currentDevice, setCurrentDevice } = useSwitchRFIDDevice()

	return (
		<RadioGroup
			value={currentDevice}
			onValueChange={(value: 'usb' | 'uhf') => setCurrentDevice(value)}
			className='flex items-center gap-x-6'>
			<Div className='flex items-center gap-3'>
				<RadioGroupItem value='uhf' id='android-device-option' disabled={shouldNotAllowUhf} />
				<Label
					htmlFor='android-device-option'
					className={cn('inline-flex items-center gap-x-2', shouldNotAllowUhf && 'text-muted-foreground')}>
					UHF <Icon name='Router' size={18} />
				</Label>
			</Div>
			<Div className='flex items-center gap-3'>
				<RadioGroupItem value='usb' id='usb-device-option' />
				<Label htmlFor='usb-device-option' className='inline-flex items-center gap-x-2'>
					USB <Icon name='Usb' size={18} />
				</Label>
			</Div>
		</RadioGroup>
	)
}

export default memo(DeviceRadioGroup)
