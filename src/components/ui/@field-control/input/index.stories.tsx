import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { object, string, type infer as Infer } from 'zod'
import type { InputFieldControlProps } from '.'
import { InputFieldControl } from '.'
import { Button } from '../../@core/button'

type Story = StoryObj<typeof InputFieldControl>
type StoryArgs = InputFieldControlProps<Record<'name', string>>

export default {
	title: 'Components/Field Controls/Input',
	component: InputFieldControl,
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
} satisfies Meta<typeof InputFieldControl>

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
		<div className='mx-auto w-full max-w-lg space-y-10'>
			<FormProvider {...form}>
				<form
					className='flex flex-col items-stretch space-y-6'
					onSubmit={form.handleSubmit((data) => setFormValues(data))}>
					<InputFieldControl {...args} />
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
		label: 'Username',
		name: 'username',
		placeholder: 'Enter your username',
		description: 'This is your unique username.',
		type: 'text',
		orientation: 'vertical'
	}
}

export const Password: Story = {
	render: Template,
	args: {
		label: 'Password',
		name: 'password',
		placeholder: '******',
		type: 'password',
		orientation: 'vertical'
	}
}

export const Disabled: Story = {
	render: Template,
	args: {
		label: 'Disabled',
		name: 'disabledInput',
		placeholder: 'Cannot type here',
		disabled: true,
		orientation: 'vertical'
	}
}

export const Horizontal: Story = {
	render: Template,
	args: {
		label: 'Horizontal',
		name: 'horizontalInput',
		placeholder: 'Horizontal layout',
		orientation: 'horizontal',
		description: 'This input is displayed in a horizontal layout.'
	}
}
