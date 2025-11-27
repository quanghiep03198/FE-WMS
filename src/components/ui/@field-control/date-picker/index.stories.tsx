import { zodResolver } from '@hookform/resolvers/zod'
import { Meta, StoryObj } from '@storybook/react'
import { format, isAfter } from 'date-fns'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { coerce, object, type infer as Infer } from 'zod'
import { DatePickerFieldControl, DatePickerFieldControlProps } from '.'
import { Button } from '../../@core/button'

type Story = StoryObj<typeof DatePickerFieldControl>
type StoryArgs = DatePickerFieldControlProps<any>

export default {
	title: 'Components/Field Controls/Date Picker',
	component: DatePickerFieldControl,
	tags: ['autodocs'],
	args: {
		name: 'date',
		label: 'Pick a date',
		description: 'Select a date from the calendar',
		calendarProps: { disabled: (date) => isAfter(date, new Date()) }
	},
	argTypes: {
		name: {
			control: 'text',
			description: 'Tên trường trong form',
			defaultValue: 'date',
			table: { type: { summary: 'string' } }
		},
		label: {
			control: 'text',
			description: 'Nhãn hiển thị cho trường',
			defaultValue: 'Pick a date',
			table: { type: { summary: 'string' } }
		},
		description: {
			control: 'text',
			description: 'Mô tả trường',
			defaultValue: 'Select a date from the calendar',
			table: { type: { summary: 'string' } }
		},
		orientation: {
			control: { type: 'radio' },
			options: ['horizontal', 'vertical'],
			description: 'Kiểu bố cục của trường',
			table: { type: { summary: '"horizontal" | "vertical"' } }
		},
		hidden: {
			control: 'boolean',
			description: 'Ẩn trường',
			defaultValue: false,
			table: { type: { summary: 'boolean' } }
		},
		calendarProps: {
			control: 'object',
			description: 'Props truyền xuống Calendar',
			table: { type: { summary: 'Partial<CalendarProps>' } }
		}
	}
} satisfies Meta<typeof DatePickerFieldControl<any>>

const formSchema = object({
	date: coerce.date({ error: 'Date is required.' })
})

type FormValues = Infer<typeof formSchema>

const Template = (args: any) => {
	'use no memo'

	const form = useForm<FormValues>({ resolver: zodResolver(formSchema), mode: 'onSubmit' })
	const [formValues, setFormValues] = useState<any>({})

	const onSubmit = (data: any) => setFormValues({ date: format(data.date, 'MMM dd,yyyy') })

	return (
		<div className='mx-auto w-full max-w-lg space-y-10'>
			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='flex w-full flex-col gap-y-6'>
					<DatePickerFieldControl {...args} />
					<Button type='submit' style={{ marginTop: 16 }}>
						Submit
					</Button>
				</form>
			</FormProvider>
			<pre className='flex flex-col divide-y rounded-md bg-secondary text-sm text-secondary-foreground [&>code:first-child]:py-2 [&>code]:p-4'>
				<code>JSON</code>
				<code>{JSON.stringify(formValues ?? {}, null, 3)}</code>
			</pre>
		</div>
	)
}

export const Default: Story = {
	render: (args: StoryArgs) => <Template {...args} calendarProps={{ ...args.calendarProps, mode: 'single' }} />
}

export const Range: Story = {
	render: (args: StoryArgs) => <Template {...args} calendarProps={{ ...args.calendarProps, mode: 'range' }} />
}
export const Horizontal: Story = {
	render: (args: StoryArgs) => (
		<Template {...args} orientation='horizontal' calendarProps={{ ...args.calendarProps, mode: 'range' }} />
	)
}
