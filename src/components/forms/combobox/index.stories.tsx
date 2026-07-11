import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { object, string, type infer as Infer } from 'zod'
import type { ComboboxFieldControlProps } from '.'
import { ComboboxFieldControl } from '.'
import { Button } from '../../ui/@core/button'
import { Form } from '../../ui/@core/form'

const meta = {
	title: 'Components/Field Controls/Combobox',
	component: ComboboxFieldControl,
	parameters: {
		// * Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
	},
	// * This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// * More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		label: {
			name: 'label',
			description: 'Nhãn của combobox'
		},
		placeholder: {
			name: 'placeholder',
			description: 'Placeholder hiển thị trên trigger của combobox'
		},
		description: {
			name: 'description',
			description: 'Mô tả của combobox'
		},
		datalist: {
			name: 'datalist',
			description: 'Dữ liệu được gán vào combobox'
		},
		labelField: {
			name: 'labelField',
			description: 'Trường dữ liệu hiển thị'
		},
		valueField: {
			name: 'valueField',
			description: 'Trường dữ liệu giá trị'
		},
		disabled: {
			name: 'disabled',
			description: 'Trạng thái disabled'
		},
		loading: {
			name: 'loading',
			description: 'Trạng thái loading'
		},
		template: {
			name: 'template',
			description: 'Custom combobox item với 1 template khác'
		},
		triggerProps: {
			name: 'triggerProps',
			description: 'Props của trigger button, dùng để custom trigger button'
		},
		shouldFilter: {
			name: 'shouldFilter',
			description: 'Sử dụng filter thủ công hoặc tự động'
		}
	}
} satisfies Meta<typeof ComboboxFieldControl>

export default meta

const formSchema = object({
	fruit: string({ error: 'Please select a fruit' }).nonempty({ message: 'Please select a fruit' })
})

type FormValues = Infer<typeof formSchema>
type StoryArgs = ComboboxFieldControlProps<Record<'id' | 'name', string>>

const Template: StoryFn<StoryArgs> = (args) => {
	'use no memo'

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema)
	})

	const [formValues, setFormValues] = useState<FormValues>(form.getValues())

	return (
		<div className='mx-auto max-w-md space-y-10'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(setFormValues)} className='grid gap-y-6'>
					<ComboboxFieldControl {...args} />
					<Button type='submit'>Submit</Button>
				</form>
			</Form>
			<pre className='flex flex-col divide-y rounded-md bg-secondary text-sm text-secondary-foreground [&>code:first-child]:py-2 [&>code]:p-4'>
				<code>JSON</code>
				<code>{JSON.stringify(formValues ?? {}, null, 3)}</code>
			</pre>
		</div>
	)
}

export const Default = Template.bind({})
Default.args = {
	name: 'fruit',
	label: 'Fruit',
	placeholder: 'Select a fruit ...',
	datalist: [
		'Apple',
		'Banana',
		'Cherry',
		'Date',
		'Elderberry',
		'Fig',
		'Grape',
		'Honeydew',
		'Ivy',
		'Jackfruit',
		'Kiwi',
		'Lemon',
		'Mango',
		'Nectarine',
		'Orange',
		'Peach'
	].map((item) => ({ id: item, name: item })),
	labelField: 'name',
	valueField: 'id'
} satisfies ComboboxFieldControlProps<Record<'id' | 'name', string>>
