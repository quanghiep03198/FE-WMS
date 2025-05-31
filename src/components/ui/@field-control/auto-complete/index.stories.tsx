import { zodResolver } from '@hookform/resolvers/zod'
import { Meta, StoryFn } from '@storybook/react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AutoCompleteFieldControl, AutoCompleteFieldControlProps } from '.'
import { Button } from '../../@core/button'
import { Form } from '../../@core/form'

const meta = {
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

export default meta

const formSchema = z.object({
	fruit: z.string({ required_error: 'Please select a fruit' }).nonempty({ message: 'Please select a fruit' })
})

type FormValues = z.infer<typeof formSchema>
type StoryArgs = AutoCompleteFieldControlProps<Record<'id' | 'name', string>>

const datalist: Record<'name', string>[] = [
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
].map((item) => ({ name: item }))

const Template: StoryFn<StoryArgs> = (args) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema)
	})

	const fruits = useMemo(
		() => [
			{ id: 'apple', name: 'Apple' },
			{ id: 'banana', name: 'Banana' },
			{ id: 'cherry', name: 'Cherry' },
			{ id: 'date', name: 'Date' },
			{ id: 'elderberry', name: 'Elderberry' },
			{ id: 'fig', name: 'Fig' },
			{ id: 'grape', name: 'Grape' },
			{ id: 'honeydew', name: 'Honeydew' },
			{ id: 'ivy', name: 'Ivy' },
			{ id: 'jackfruit', name: 'Jackfruit' },
			{ id: 'kiwi', name: 'Kiwi' },
			{ id: 'lemon', name: 'Lemon' },
			{ id: 'mango', name: 'Mango' },
			{ id: 'nectarine', name: 'Nectarine' },
			{ id: 'orange', name: 'Orange' },
			{ id: 'peach', name: 'Peach' }
		],
		[]
	)

	const [formValues, setFormValues] = useState<FormValues>(form.getValues())

	return (
		<div className='mx-auto max-w-md space-y-10'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(setFormValues)} className='grid gap-y-6'>
					<AutoCompleteFieldControl {...args} />
					<Button type='submit'>Submit</Button>
				</form>
			</Form>
			<pre className='flex flex-col divide-y rounded-md bg-secondary text-sm text-secondary-foreground [&>code:first-child]:py-2 [&>code]:p-4'>
				<code>JSON</code>
				<code>{JSON.stringify(formValues, null, 3)}</code>
			</pre>
		</div>
	)
}

export const Default = Template.bind({})
Default.args = {
	name: 'fruit',
	label: 'Fruit',
	placeholder: 'Select a fruit ...',
	description: 'Choose your favorite fruit',
	datalist: [
		{ id: 'apple', name: 'Apple' },
		{ id: 'banana', name: 'Banana' },
		{ id: 'cherry', name: 'Cherry' },
		{ id: 'date', name: 'Date' },
		{ id: 'elderberry', name: 'Elderberry' },
		{ id: 'fig', name: 'Fig' },
		{ id: 'grape', name: 'Grape' },
		{ id: 'honeydew', name: 'Honeydew' },
		{ id: 'ivy', name: 'Ivy' },
		{ id: 'jackfruit', name: 'Jackfruit' },
		{ id: 'kiwi', name: 'Kiwi' },
		{ id: 'lemon', name: 'Lemon' },
		{ id: 'mango', name: 'Mango' },
		{ id: 'nectarine', name: 'Nectarine' },
		{ id: 'orange', name: 'Orange' },
		{ id: 'peach', name: 'Peach' }
	],
	labelField: 'name',
	valueField: 'id'
} satisfies AutoCompleteFieldControlProps<Record<'id' | 'name', string>>
