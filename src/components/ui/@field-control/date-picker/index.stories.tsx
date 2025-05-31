import { Meta, StoryObj } from '@storybook/react'
import { isAfter } from 'date-fns'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '../../@core/button'
import { DatePickerFieldControl } from './index'

const meta: Meta<typeof DatePickerFieldControl> = {
	title: 'Components/Field Controls/Date Picker',
	component: DatePickerFieldControl,
	tags: ['autodocs'],
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
}
export default meta

const Template = (args: any) => {
	const methods = useForm({ defaultValues: { date: null } })
	const [formValues, setFormValues] = useState<any>(null)

	const onSubmit = (data: any) => setFormValues(data)

	return (
		<div className='mx-auto max-w-md space-y-10'>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)} style={{ maxWidth: 400 }} className='grid gap-y-6'>
					<DatePickerFieldControl
						name='date'
						label='Pick a date'
						description='Select a date from the calendar'
						calendarProps={{
							disabled: (date) => isAfter(date, new Date()) // Disable future dates
						}}
						{...args}
					/>
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

export const Default: StoryObj = {
	render: (args) => (
		<Template {...args} calendarProps={{ mode: 'single', disabled: (date) => isAfter(date, new Date()) }} />
	)
}

export const Range: StoryObj = {
	render: (args) => (
		<Template {...args} calendarProps={{ mode: 'range', disabled: (date) => isAfter(date, new Date()) }} />
	)
}
