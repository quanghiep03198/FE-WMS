import { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../@core/button'

import { Form } from '../../@core/form'
import { TagInputFieldControl, TagInputFieldControlProps } from './index'

const datalist: Record<'id' | 'name', string>[] = [
	{ id: 'angular', name: 'Angular' },
	{ id: 'astrojs', name: 'AstroJS' },
	{ id: 'backbonejs', name: 'BackboneJS' },
	{ id: 'emberjs', name: 'EmberJS' },
	{ id: 'lit', name: 'Lit' },
	{ id: 'nextjs', name: 'NextJS' },
	{ id: 'nuxtjs', name: 'NuxtJS' },
	{ id: 'react', name: 'React' },
	{ id: 'solid', name: 'Solid' },
	{ id: 'svelte', name: 'Svelte' },
	{ id: 'vuejs', name: 'VueJS' }
]

const meta: Meta<typeof TagInputFieldControl> = {
	title: 'Components/Field Controls/Tag Input',
	component: TagInputFieldControl,
	tags: ['autodocs'],
	args: {
		name: 'frameworks',
		label: 'Frameworks',
		labelField: 'name',
		valueField: 'id',
		placeholder: 'Select frameworks ...',
		datalist: datalist
	},
	parameters: {
		docs: {
			autodocs: true
		}
	},
	argTypes: {
		name: { control: 'text', description: 'Tên trường trong form' },
		label: { control: 'text', description: 'Nhãn hiển thị' },
		datalist: { control: 'object', description: 'Danh sách dữ liệu tag' },
		labelField: { control: 'text', description: 'Trường hiển thị label của tag' },
		valueField: { control: 'text', description: 'Trường giá trị của tag' },
		placeholder: { control: 'text', description: 'Placeholder cho input' },
		orientation: { control: 'radio', options: ['horizontal', 'vertical'], description: 'Kiểu bố cục' },
		hidden: { control: 'boolean', description: 'Ẩn trường' },
		className: { control: 'text', description: 'Class CSS bổ sung' }
	}
}
export default meta

const Template = (args: TagInputFieldControlProps<any, Record<'id' | 'name', string>>) => {
	const form = useForm({})
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
	render: Template
}
