import { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../@core/button'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '../../@core/form'
import { TagInputFieldControl, TagInputFieldControlProps } from './index'

export default {
	title: 'Components/Field Controls/Tag Input',
	component: TagInputFieldControl,
	tags: ['autodocs'],
	args: {
		name: 'frameworks',
		label: 'Frameworks',
		placeholder: 'Select frameworks ...'
	},
	parameters: {
		docs: {
			autodocs: true
		}
	},
	argTypes: {
		name: { control: 'text', description: 'Tên trường trong form' },
		label: { control: 'text', description: 'Nhãn hiển thị' },
		placeholder: { control: 'text', description: 'Placeholder cho input' },
		orientation: { control: 'radio', options: ['horizontal', 'vertical'], description: 'Kiểu bố cục' },
		hidden: { control: 'boolean', description: 'Ẩn trường' },
		className: { control: 'text', description: 'Class CSS bổ sung' }
	}
} satisfies Meta<typeof TagInputFieldControl>

const schema = z.object({
	frameworks: z
		.array(z.string(), { required_error: 'This field is required at least 1 item' })
		.nonempty({ message: 'This field is required at least 1 item' })
})

type FormValues = z.infer<typeof schema>

const Template = (args: TagInputFieldControlProps<any>) => {
	'use no memo'

	const form = useForm<FormValues>({
		resolver: zodResolver(schema)
	})
	const [formValues, setFormValues] = useState(form.getValues())

	return (
		<div className='mx-auto max-w-md space-y-10'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(setFormValues)} className='grid gap-y-6'>
					<TagInputFieldControl {...args} />
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

export const Default: StoryObj<typeof TagInputFieldControl> = {
	render: Template,
	args: {
		name: 'frameworks',
		label: 'Frameworks',
		placeholder: 'Enter frameworks ...',
		description: 'Enter your favorite frameworks'
	}
}

export const Horizontal: StoryObj<typeof TagInputFieldControl> = {
	render: Template,
	args: {
		name: 'frameworks',
		label: 'Frameworks',
		placeholder: 'Enter frameworks ...',
		description: 'Enter your favorite frameworks',
		orientation: 'horizontal'
	}
}
