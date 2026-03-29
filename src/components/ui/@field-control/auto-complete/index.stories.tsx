import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { object, string, type infer as Infer } from 'zod'
import type { AutoCompleteFieldControlProps } from '.'
import { AutoCompleteFieldControl } from '.'
import { Button } from '../../@core/button'
import { Form } from '../../@core/form'

type Story = Meta<typeof AutoCompleteFieldControl<any, Record<'name', string>>>
type StoryArgs = AutoCompleteFieldControlProps<Record<'name', string>>

export default {
	title: 'Components/Field Controls/Auto Complete',
	component: AutoCompleteFieldControl,
	parameters: {
		// * Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
	},
	// * This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// * More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		label: {
			name: 'label',
			description: 'Nhãn của autocomplete'
		},
		placeholder: {
			name: 'placeholder',
			description: 'Placeholder hiển thị trên trigger của autocomplete'
		},
		description: {
			name: 'description',
			description: 'Mô tả của autocomplete'
		},
		datalist: {
			name: 'datalist',
			description: 'Dữ liệu được gán vào autocomplete'
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
			description: 'Custom autocomplete item với 1 template khác'
		},
		shouldFilter: {
			name: 'shouldFilter',
			description: 'Sử dụng filter thủ công hoặc tự động'
		}
	}
} satisfies Meta<typeof AutoCompleteFieldControl>

const formSchema = object({
	fruit: string({ error: 'Please select a fruit' }).nonempty({ message: 'Please select a fruit' })
})

type FormValues = Infer<typeof formSchema>

const Template: StoryFn<StoryArgs> = (args) => {
	'use no memo'

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema)
	})

	const [formValues, setFormValues] = useState<FormValues>(form.getValues())

	return (
		<div className='mx-auto max-w-lg space-y-10'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(setFormValues)} className='flex flex-col gap-y-6'>
					<AutoCompleteFieldControl {...args} />
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

const datalist: Record<'name', string>[] = [
	{ name: 'Apple' },
	{ name: 'Banana' },
	{ name: 'Cherry' },
	{ name: 'Date' },
	{ name: 'Elderberry' },
	{ name: 'Fig' },
	{ name: 'Grape' },
	{ name: 'Honeydew' },
	{ name: 'Ivy' },
	{ name: 'Jackfruit' },
	{ name: 'Kiwi' },
	{ name: 'Lemon' },
	{ name: 'Mango' },
	{ name: 'Nectarine' },
	{ name: 'Orange' },
	{ name: 'Peach' }
]

export const Default: Story = {
	render: Template,
	args: {
		name: 'fruit',
		label: 'Favourite fruit',
		placeholder: 'Select a fruit ...',
		description: 'Choose your favorite fruit',
		orientation: 'vertical',
		datalist: datalist,
		labelField: 'name',
		valueField: 'name'
	}
}
export const Horizontal: Story = {
	render: Template,
	args: {
		name: 'fruit',
		label: 'Favourite fruit',
		shouldFilter: true,
		placeholder: 'Select a fruit ...',
		description: 'Choose your favorite fruit',
		orientation: 'horizontal',
		datalist: datalist,
		labelField: 'name',
		valueField: 'name'
	}
}
