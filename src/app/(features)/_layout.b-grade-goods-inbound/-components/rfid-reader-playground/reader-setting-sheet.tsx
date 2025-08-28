import { cn } from '@/common/utils/cn'
import {
	Button,
	buttonVariants,
	Form,
	Icon,
	InputFieldControl,
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

type Props = {}

const ReaderSettingSheet: React.FC<Props> = (props) => {
	const { t } = useTranslation()
	const form = useForm()

	return (
		<Sheet>
			<SheetTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
				<Icon name='Settings' size={18} />
			</SheetTrigger>
			<SheetContent className='flex max-w-xl flex-col items-stretch gap-y-6'>
				<SheetHeader>
					<SheetTitle>RFID Reader Settings</SheetTitle>
					<SheetDescription>
						This sheet allows you to configure the settings for the RFID reader. You can specify the reader's
						network details, such as its IP address, to ensure proper connectivity and functionality.
					</SheetDescription>
				</SheetHeader>
				<Form {...form}>
					<SheetForm>
						<InputFieldControl
							label='Reader TCP/IP'
							name='reader_ip'
							orientation='horizontal'
							description='Enter the IP address of the RFID reader. This should be in the format of a valid IPv4 address (e.g., 192.168.1.1).'
						/>
						<InputFieldControl
							label='Reader TCP/IP'
							name='reader_ip'
							orientation='horizontal'
							description='Enter the IP address of the RFID reader. This should be in the format of a valid IPv4 address (e.g., 192.168.1.1).'
						/>
						<InputFieldControl
							label='Reader TCP/IP'
							name='reader_ip'
							orientation='horizontal'
							description='Enter the IP address of the RFID reader. This should be in the format of a valid IPv4 address (e.g., 192.168.1.1).'
						/>
					</SheetForm>
				</Form>
				<SheetFooter className='gap-2'>
					<Button>{t('ns_common:actions.save')}</Button>
					<SheetClose className={cn(buttonVariants({ variant: 'secondary' }))}>
						{t('ns_common:actions.cancel')}
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}

const SheetForm = tw.form`flex h-full flex-1 flex-col gap-y-6`

export default ReaderSettingSheet
