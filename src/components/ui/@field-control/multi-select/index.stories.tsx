import { Button, Form } from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Meta, StoryFn, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { array, object, string, type infer as Infer } from 'zod'
import { MultipleSelectFieldControlProps, MultiSelectFieldControl } from '.'

export default {
	title: 'Components/Field Controls/Multi-select',
	component: MultiSelectFieldControl,
	tags: ['autodocs'],
	argTypes: {
		name: {
			description: 'Tên trường trong form',
			control: { type: 'text' },
			type: { name: 'string', required: true }
		},
		label: {
			description: 'Nhãn hiển thị cho trường',
			control: { type: 'text' }
		},
		placeholder: {
			description: 'Placeholder cho trường chọn',
			control: { type: 'text' }
		},
		description: {
			description: 'Mô tả ngắn cho trường',
			control: { type: 'text' }
		},
		datalist: {
			description: 'Danh sách dữ liệu để chọn',
			control: { type: 'object' }
		},
		labelField: {
			description: 'Tên trường hiển thị trong datalist',
			control: { type: 'text' },
			defaultValue: 'name'
		},
		valueField: {
			description: 'Tên trường giá trị trong datalist',
			control: { type: 'text' },
			defaultValue: 'id'
		},
		shouldFilter: {
			description: 'Có cho phép lọc dữ liệu không',
			control: { type: 'boolean' },
			defaultValue: true
		},
		defaultValue: {
			description: 'Giá trị mặc định',
			control: { type: 'object' }
		},
		orientation: {
			description: 'Kiểu bố cục: dọc hoặc ngang',
			control: { type: 'radio' },
			options: ['vertical', 'horizontal'],
			defaultValue: 'vertical'
		},
		hidden: {
			description: 'Ẩn trường này',
			control: { type: 'boolean' }
		},
		onValueChange: {
			description: 'Callback khi giá trị thay đổi',
			action: 'onValueChange'
		},
		onInput: {
			description: 'Callback khi nhập dữ liệu',
			action: 'onInput'
		}
	},
	parameters: {
		docs: {
			description: {
				component: 'Trường chọn nhiều giá trị, tích hợp với react-hook-form.'
			}
		}
	}
} satisfies Meta<typeof MultiSelectFieldControl>

const schema = object({
	fruits: array(string().nonempty()).nonempty({ error: 'Vui lòng chọn ít nhất một loại quả' })
})

type FormValues = Infer<typeof schema>
type StoryArgs = MultipleSelectFieldControlProps<any, Record<'name', string>>
type Story = Meta<StoryArgs>['component'] extends React.ComponentType<infer P> ? StoryObj<P> : never

const Template: StoryFn<StoryArgs> = (args) => {
	'use no memo'

	const form = useForm<FormValues>({
		resolver: zodResolver(schema)
	})

	const [formValues, setFormValues] = useState<FormValues>(form.getValues())

	return (
		<div className='mx-auto max-w-md space-y-10'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(setFormValues)} className='flex flex-col gap-y-6'>
					<MultiSelectFieldControl {...args} />
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
		name: 'fruits',
		label: 'Chọn nhiều giá trị',
		placeholder: 'Chọn...',
		description: 'Bạn có thể chọn nhiều giá trị từ danh sách.',
		orientation: 'vertical',
		datalist,
		labelField: 'name',
		valueField: 'name',
		shouldFilter: true,
		maxCount: 5,
		hidden: false
	}
}
export const Horizontal: Story = {
	render: Template,
	args: {
		name: 'fruits',
		label: 'Chọn nhiều giá trị',
		placeholder: 'Chọn...',
		description: 'Bạn có thể chọn nhiều giá trị từ danh sách.',
		orientation: 'horizontal',
		datalist,
		labelField: 'name',
		valueField: 'name',
		shouldFilter: true,
		hidden: false
	}
}
