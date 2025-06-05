import { zodResolver } from '@hookform/resolvers/zod'
import { Meta, StoryFn, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SelectFieldControl, SelectFieldControlProps } from '.'
import { Button } from '../../@core/button'
import { Form } from '../../@core/form'

export default {
	title: 'Components/Field Controls/Select',
	component: SelectFieldControl,
	tags: ['autodocs'],
	argTypes: {
		name: {
			description: 'Tên trường form (bắt buộc)',
			control: { type: 'text' }
		},
		label: {
			description: 'Nhãn hiển thị cho trường select',
			control: { type: 'text' }
		},
		placeholder: {
			description: 'Placeholder hiển thị khi chưa chọn',
			control: { type: 'text' }
		},
		datalist: {
			description: 'Danh sách dữ liệu để render các option',
			control: { type: 'object' }
		},
		labelField: {
			description: 'Trường dùng làm label hiển thị cho option',
			control: { type: 'text' }
		},
		valueField: {
			description: 'Trường dùng làm value cho option',
			control: { type: 'text' }
		},
		description: {
			description: 'Mô tả phụ cho trường select',
			control: { type: 'text' }
		},
		orientation: {
			description: 'Kiểu bố cục: "horizontal" hoặc mặc định',
			control: { type: 'text' }
		},
		hidden: {
			description: 'Ẩn trường select',
			control: { type: 'boolean' }
		},
		className: {
			description: 'Custom class cho select',
			control: { type: 'text' }
		}
	},
	parameters: {
		docs: {
			description: {
				component: 'Trường chọn giá trị trong select, tích hợp với react-hook-form.'
			}
		}
	}
} satisfies Meta<typeof SelectFieldControl>

const formSchema = z.object({
	fruit: z.string({ required_error: 'Please select a fruit' }).nonempty({ message: 'Please select a fruit' })
})

type FormValues = z.infer<typeof formSchema>
type StoryArgs = SelectFieldControlProps<any, Record<'name', string>>

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
					<SelectFieldControl {...args} />
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

type Story = Meta<StoryArgs>['component'] extends React.ComponentType<infer P> ? StoryObj<P> : never

const fruits: Record<'name', string>[] = [
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
		datalist: fruits,
		labelField: 'name',
		valueField: 'name',
		className: 'w-full'
	}
}
export const Horizontal: Story = {
	render: Template,
	args: {
		name: 'fruit',
		label: 'Favourite fruit',
		placeholder: 'Select a fruit ...',
		description: 'Choose your favorite fruit',
		datalist: fruits,
		labelField: 'name',
		valueField: 'name',
		className: 'w-full',
		orientation: 'horizontal'
	}
}
