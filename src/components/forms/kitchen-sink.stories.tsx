import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { TextareaFieldControl } from '@components/forms/textarea'
import { Button } from '@components/ui/button'
import { Checkbox } from '@components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form'
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group'
import { Separator } from '@components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta } from '@storybook/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { array, boolean, coerce, email, enum as enums, object, string, type infer as Infer } from 'zod'

import { isAfter } from 'date-fns'
import { DatePickerFieldControl } from './date-picker'
import { InputFieldControl } from './input'
import { SelectFieldControl } from './select'

export default {
	title: 'Components/Field Controls/Kitchen Sink',
	tags: ['autodocs'],
	args: {}
} satisfies Meta<any>

const schema = object({
	// Personal Information
	firstName: string().min(2, 'Tên phải có ít nhất 2 ký tự'),
	lastName: string().min(2, 'Họ phải có ít nhất 2 ký tự'),
	email: email('Email không hợp lệ'),
	phone: string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
	dateOfBirth: coerce.date({
		error: 'Vui lòng chọn ngày sinh'
	}),
	gender: enums(['male', 'female', 'other'], {
		error: 'Vui lòng chọn giới tính'
	}),

	// Work Information
	employeeId: string().min(3, 'Mã nhân viên phải có ít nhất 3 ký tự'),
	department: string({
		error: 'Vui lòng chọn phòng ban'
	}),
	position: string().min(2, 'Chức vụ phải có ít nhất 2 ký tự'),
	salary: string().min(1, 'Vui lòng nhập mức lương'),
	startDate: coerce.date({
		error: 'Vui lòng chọn ngày bắt đầu làm việc'
	}),
	workType: enums(['full-time', 'part-time', 'contract'], {
		error: 'Vui lòng chọn loại hình làm việc'
	}),

	// Additional Information
	address: string().min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
	skills: array(string()).refine((value) => value.some((item) => item), {
		message: 'Vui lòng chọn ít nhất một kỹ năng'
	}),

	hasExperience: boolean(),
	notes: string().optional()
})

export const Template = () => {
	'use no memo'

	const form = useForm<Infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			employeeId: '',
			position: '',
			salary: '',
			gender: 'male',
			address: '',
			skills: [],
			hasExperience: false,
			notes: ''
		}
	})

	const [formValues, setFormValues] = useState(form.getValues())

	const onSubmit = (data: any) => {
		setFormValues(data)
	}

	return (
		<div className='space-y-10'>
			<Form {...form}>
				<form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
					<Div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
						{/* Personal Information Section */}
						<Div className='space-y-4'>
							<Typography className='text-lg font-semibold' variant='h4'>
								Thông tin cá nhân
							</Typography>
							<InputFieldControl
								description='Họ của nhân viên, ví dụ: Nguyễn'
								hidden={false}
								label='Họ'
								name='lastName'
								orientation='vertical'
								placeholder='Nhập họ'
							/>
							<InputFieldControl
								description='Tên của nhân viên, ví dụ: Nguyễn Văn'
								hidden={false}
								label='Tên'
								name='firstName'
								orientation='vertical'
								placeholder='Nhập tên'
							/>
							<DatePickerFieldControl
								calendarProps={{ mode: 'single', disabled: (value) => isAfter(value, new Date()) }}
								label='Ngày sinh'
								name='dateOfBirth'
							/>
							<FormField
								control={form.control}
								name='gender'
								render={({ field }) => (
									<FormItem className='space-y-3'>
										<FormLabel>Giới tính *</FormLabel>
										<FormControl>
											<RadioGroup
												className='flex flex-col space-y-1'
												defaultValue={field.value}
												onValueChange={field.onChange}>
												<div className='flex items-center space-x-2'>
													<RadioGroupItem id='male' value='male' />
													<label htmlFor='male'>Nam</label>
												</div>
												<div className='flex items-center space-x-2'>
													<RadioGroupItem id='female' value='female' />
													<label htmlFor='female'>Nữ</label>
												</div>
												<div className='flex items-center space-x-2'>
													<RadioGroupItem id='other' value='other' />
													<label htmlFor='other'>Khác</label>
												</div>
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<InputFieldControl
								description='Địa chỉ email liên hệ công việc.'
								label='Email'
								name='email'
								placeholder='example@gmail.com'
								type='email'
							/>
							<InputFieldControl
								description='Số điện thoại liên lạc cá nhân'
								label='Số điện thoại'
								name='phone'
								placeholder='xxxx xxx xxx'
							/>
						</Div>

						<Separator />

						{/* Work Information Section */}
						<Div className='space-y-4'>
							<Typography className='text-lg font-semibold' variant='h4'>
								Thông tin công việc
							</Typography>
							<InputFieldControl
								description='Mã định danh duy nhất cho nhân viên'
								label='Mã nhân viên'
								name='employeeId'
								placeholder='Nhập mã nhân viên'
							/>

							<SelectFieldControl
								description='Chọn phòng ban mà nhân viên làm việc'
								label='Phòng ban'
								labelField='label'
								name='department'
								placeholder='Chọn phòng ban'
								valueField='value'
								datalist={[
									{ value: 'it', label: 'Công nghệ thông tin' },
									{ value: 'hr', label: 'Nhân sự' },
									{ value: 'accounting', label: 'Kế toán' },
									{ value: 'sales', label: 'Kinh doanh' },
									{ value: 'marketing', label: 'Marketing' }
								]}
							/>
							<InputFieldControl
								description='Chức vụ cán bộ, công nhân viên đang đảm nhiệm'
								label='Chức vụ'
								name='position'
								placeholder='Nhập chức vụ'
							/>
							<InputFieldControl
								description='Nhập mức lương cơ bản (VND)'
								label='Mức lương'
								name='salary'
								placeholder='VND'
							/>

							<DatePickerFieldControl
								calendarProps={{ mode: 'single', disabled: (value) => isAfter(value, new Date()) }}
								label='Ngày vào làm'
								name='startDate'
							/>

							<SelectFieldControl
								label='Loại hình làm việc'
								labelField='label'
								name='workType'
								valueField='value'
								datalist={[
									{ value: 'full-time', label: 'Toàn thời gian' },
									{ value: 'part-time', label: 'Bán thời gian' },
									{ value: 'contract', label: 'Hợp đồng' }
								]}
							/>
						</Div>
					</Div>

					{/* Additional Information Section */}
					<Div className='space-y-6'>
						<Typography className='text-lg font-semibold'>Thông tin bổ sung</Typography>
						<TextareaFieldControl
							description='Địa chỉ nơi ở của nhân viên, bao gồm số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố'
							label='Địa chỉ'
							name='address'
							orientation='vertical'
							placeholder='Nhập địa chỉ đầy đủ'
						/>
						<FormField
							control={form.control}
							name='skills'
							render={() => (
								<FormItem>
									<div className='mb-6'>
										<FormLabel className='text-base'>Kỹ năng *</FormLabel>
										<FormDescription>Chọn các kỹ năng mà nhân viên sở hữu</FormDescription>
									</div>
									{['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL'].map((skill) => (
										<FormField
											control={form.control}
											key={skill}
											name='skills'
											render={({ field }) => {
												return (
													<FormItem className='flex flex-row items-start space-y-0 space-x-3' key={skill}>
														<FormControl>
															<Checkbox
																checked={field.value?.includes(skill)}
																onCheckedChange={(checked) => {
																	return checked
																		? field.onChange([...field.value, skill])
																		: field.onChange(field.value?.filter((value) => value !== skill))
																}}
															/>
														</FormControl>
														<FormLabel className='font-normal'>{skill}</FormLabel>
													</FormItem>
												)
											}}
										/>
									))}
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='hasExperience'
							render={({ field }) => (
								<FormItem className='flex flex-row items-start space-y-0 space-x-3'>
									<FormControl>
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<div className='space-y-1 leading-none'>
										<FormLabel>Có kinh nghiệm làm việc trước đây</FormLabel>
										<FormDescription>Đánh dấu nếu nhân viên đã có kinh nghiệm làm việc</FormDescription>
									</div>
								</FormItem>
							)}
						/>
						<TextareaFieldControl
							description='Thông tin bổ sung hoặc ghi chú đặc biệt về nhân viên'
							label='Ghi chú'
							name='notes'
							orientation='vertical'
							placeholder='Thêm ghi chú về nhân viên...'
						/>
					</Div>

					<Button className='w-full' type='submit'>
						Lưu thông tin nhân viên
					</Button>
				</form>
			</Form>
			<pre className='bg-secondary text-secondary-foreground flex flex-col divide-y rounded-md text-sm [&>code]:p-4 [&>code:first-child]:py-2'>
				<code>JSON</code>
				<code>{JSON.stringify(formValues ?? {}, null, 3)}</code>
			</pre>
		</div>
	)
}
