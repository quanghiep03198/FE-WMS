import { zodResolver } from '@hookform/resolvers/zod'
import { Meta, StoryFn, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { object, string, type infer as Infer } from 'zod'
import { TextareaFieldControl, TextareaFieldControlProps } from '.'
import { Button } from '../../@core/button'

type Story = StoryObj<typeof TextareaFieldControl>
type StoryArgs = TextareaFieldControlProps<Record<'name', string>>

export default {
	title: 'Components/Field Controls/Textarea',
	component: TextareaFieldControl,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		name: { control: 'text' },
		placeholder: { control: 'text' },
		description: { control: 'text' },
		type: { control: 'text' },
		disabled: { control: 'boolean' },
		hidden: { control: 'boolean' },
		orientation: { control: 'radio', options: ['horizontal', 'vertical'] }
	}
} satisfies Meta<typeof TextareaFieldControl>

const formSchema = object({})

type FormValues = Infer<typeof formSchema>

const Template: StoryFn<StoryArgs> = (args: any) => {
	'use no memo'

	const form = useForm<FormValues>({
		resolver: zodResolver(
			formSchema.extend({
				[args.name]: string({ error: 'This field is required.' }).nonempty('This field is required.')
			})
		),
		mode: 'onSubmit'
	})

	const [formValues, setFormValues] = useState(form.getValues())

	return (
		<div className='mx-auto w-full max-w-xl space-y-10'>
			<FormProvider {...form}>
				<form
					className='flex flex-col items-stretch space-y-6'
					onSubmit={form.handleSubmit((data) => setFormValues(data))}>
					<TextareaFieldControl {...args} />
					<Button type='submit'>Submit</Button>
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
	render: Template,
	args: {
		label: 'Message',
		name: 'message',
		placeholder: 'Leave your message here...',
		description: 'This is a textarea for your message.',
		type: 'text',
		orientation: 'vertical',
		rows: 5
	}
}

export const Disabled: Story = {
	render: Template,
	args: {
		label: 'Disabled',
		name: 'disabledTextarea',
		placeholder: 'Cannot type here',
		disabled: true,
		orientation: 'vertical'
	}
}

export const Horizontal: Story = {
	render: Template,
	args: {
		label: 'Message',
		name: 'horizontalTextarea',
		placeholder: 'Horizontal layout',
		orientation: 'horizontal',
		description: 'This input is displayed in a horizontal layout.',
		rows: 5
	}
}
