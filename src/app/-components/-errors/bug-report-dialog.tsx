import { cn } from '@/common/utils/cn'
import {
	Button,
	buttonVariants,
	Dialog,
	DialogTrigger,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	TextareaFieldControl
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogContent } from '@radix-ui/react-dialog'
import { captureFeedback } from '@sentry/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { z } from 'zod'

const reportValidator = z.object({
	email: z.string().email('Invalid email').nonempty('Email is required'),
	name: z.string().nonempty('Name is required'),
	message: z.string().optional()
})

const BugReportDialog: React.FC<{ eventId: string }> = ({ eventId }) => {
	const { t } = useTranslation()
	const [open, setOpen] = useState<boolean>(false)

	const form = useForm({
		resolver: zodResolver(reportValidator)
	})

	const handleSubmit = (data) => {
		captureFeedback(data, { event_id: eventId })
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className={cn(buttonVariants({ variant: 'ghost' }))}>
				{t('ns_common:actions.report_bug')}
				<Icon name='ArrowUpRight' />
			</DialogTrigger>
			<DialogContent className='max-w-4xl'>
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(handleSubmit)}>
						<InputFieldControl name='email' label='Email' type='email' placeholder='example@email.com' />
						<InputFieldControl name='name' label='Name' placeholder='Your name' />
						<TextareaFieldControl
							name='description'
							label='What happened?'
							placeholder='I clicked to the submit button then this error come up with'
							rows={5}
						/>
						<Button type='submit'>{t('ns_common:actions.submit')}</Button>
					</Form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}

const Form = tw.form`space-y-6`

export default BugReportDialog
