import { Div, Icon, Label, RadioGroup, RadioGroupItem } from '@/components/ui'
import { memo } from 'react'
import { useSwitchRFIDDevice } from '../-hooks/use-switch-rfid-device'

const DeviceRadioGroup: React.FC = () => {
	const { setCurrentDevice } = useSwitchRFIDDevice()

	return (
		<RadioGroup
			defaultValue={'android'}
			onValueChange={(value: 'usb' | 'android') => setCurrentDevice(value)}
			className='flex items-center gap-x-6'>
			<Div className='flex items-center gap-3'>
				<RadioGroupItem value='android' id='android-device-option' />
				<Label htmlFor='android-device-option' className='inline-flex items-center gap-x-2'>
					Android <Icon name='SmartphoneNfc' size={18} />
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
