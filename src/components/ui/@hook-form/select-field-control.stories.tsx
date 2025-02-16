import { zodResolver } from '@hookform/resolvers/zod'
import { Meta, StoryFn } from '@storybook/react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../@core/button'
import { Form } from '../@core/form'
import { SelectFieldControl, SelectFieldControlProps } from './select-field-control'

export default {
	title: 'Components/Form/SelectFieldControl',
	component: SelectFieldControl
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
						valueField='name'
					/>
					<Button type='submit'>Submit</Button>
				</form>
				<pre>
					<code>{JSON.stringify(formValues, null, 2)}</code>
				</pre>
			</Form>
		</div>
	)
}
