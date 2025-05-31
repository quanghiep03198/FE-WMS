import { zodResolver } from '@hookform/resolvers/zod'
import { Meta, StoryFn } from '@storybook/react'
import { useMemo, useState } from 'react'
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
	}
} as Meta

const formSchema = z.object({
	fruit: z.string({ required_error: 'Please select a fruit' }).nonempty({ message: 'Please select a fruit' })
})

type FormValues = z.infer<typeof formSchema>
type StoryArgs = SelectFieldControlProps<any, Record<'id' | 'name', string>>

export const Template: StoryFn<StoryArgs> = () => {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema)
	})
	const [formValues, setFormValues] = useState<FormValues>(form.getValues())

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

	return (
		<div className='mx-auto max-w-md space-y-10'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(setFormValues)} className='grid gap-y-6'>
					<SelectFieldControl
						name='fruit'
						label='Fruit'
						placeholder='Select a fruit ...'
						datalist={fruits}
						labelField='name'
						valueField='id'
					/>
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
