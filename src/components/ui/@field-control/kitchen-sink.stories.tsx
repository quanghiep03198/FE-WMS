import { zodResolver } from '@hookform/resolvers/zod'
import { Meta } from '@storybook/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '../@core/form'

export default {
	title: 'Components/Field Controls/Kitchen Sink',
	tags: ['autodocs'],
	args: {}
} satisfies Meta<any>

const schema = z.object({})

export const Template = () => {
	const form = useForm({
		resolver: zodResolver(schema)
	})

	const [formValues, setFormValues] = useState(form.getValues())

	return (
		<div className='space-y-10'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(setFormValues)}></form>
			</Form>
			<pre className='flex flex-col divide-y rounded-md bg-secondary text-sm text-secondary-foreground [&>code:first-child]:py-2 [&>code]:p-4'>
				<code>JSON</code>
				<code>{JSON.stringify(formValues ?? {}, null, 3)}</code>
			</pre>
		</div>
	)
}
