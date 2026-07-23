import {
	Button,
	Checkbox,
	Div,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	RadioGroup,
	RadioGroupItem,
	Separator,
	TextareaFieldControl,
	Typography
} from '@components/ui'
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
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
					<Div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
						{/* Personal Information Section */}
						<Div className='space-y-4'>
							<Typography variant='h4' className='text-lg font-semibold'>
								Thông tin cá nhân
							</Typography>
							<InputFieldControl
								label='Họ'
								name='lastName'
								placeholder='Nhập họ'
								description='Họ của nhân viên, ví dụ: Nguyễn'
								hidden={false}
								orientation='vertical'
							/>
							<InputFieldControl
								label='Tên'
								name='firstName'
								placeholder='Nhập tên'
								description='Tên của nhân viên, ví dụ: Nguyễn Văn'
								hidden={false}
								orientation='vertical'
							/>
							<DatePickerFieldControl
								label='Ngày sinh'
								name='dateOfBirth'
								calendarProps={{ mode: 'single', disabled: (value) => isAfter(value, new Date()) }}
							/>
							<FormField
								control={form.control}
								name='gender'
								render={({ field }) => (
									<FormItem className='space-y-3'>
										<FormLabel>Giới tính *</FormLabel>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												defaultValue={field.value}
												className='flex flex-col space-y-1'>
												<div className='flex items-center space-x-2'>
													<RadioGroupItem value='male' id='male' />
													<label htmlFor='male'>Nam</label>
												</div>
												<div className='flex items-center space-x-2'>
													<RadioGroupItem value='female' id='female' />
													<label htmlFor='female'>Nữ</label>
												</div>
												<div className='flex items-center space-x-2'>
													<RadioGroupItem value='other' id='other' />
													<label htmlFor='other'>Khác</label>
												</div>
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<InputFieldControl
								label='Email'
								name='email'
								type='email'
								placeholder='example@gmail.com'
								description='Địa chỉ email liên hệ công việc.'
							/>
							<InputFieldControl
								label='Số điện thoại'
								name='phone'
								placeholder='xxxx xxx xxx'
								description='Số điện thoại liên lạc cá nhân'
							/>
						</Div>

						<Separator />

						{/* Work Information Section */}
						<Div className='space-y-4'>
							<Typography variant='h4' className='text-lg font-semibold'>
								Thông tin công việc
							</Typography>
							<InputFieldControl
								label='Mã nhân viên'
								name='employeeId'
								placeholder='Nhập mã nhân viên'
								description='Mã định danh duy nhất cho nhân viên'
							/>

							<SelectFieldControl
								label='Phòng ban'
								name='department'
								datalist={[
									{ value: 'it', label: 'Công nghệ thông tin' },
									{ value: 'hr', label: 'Nhân sự' },
									{ value: 'accounting', label: 'Kế toán' },
									{ value: 'sales', label: 'Kinh doanh' },
									{ value: 'marketing', label: 'Marketing' }
								]}
								labelField='label'
								valueField='value'
								placeholder='Chọn phòng ban'
								description='Chọn phòng ban mà nhân viên làm việc'
							/>
							<InputFieldControl
								label='Chức vụ'
								name='position'
								placeholder='Nhập chức vụ'
								description='Chức vụ cán bộ, công nhân viên đang đảm nhiệm'
							/>
							<InputFieldControl
								label='Mức lương'
								name='salary'
								placeholder='VND'
								description='Nhập mức lương cơ bản (VND)'
							/>

							<DatePickerFieldControl
								label='Ngày vào làm'
								name='startDate'
								calendarProps={{ mode: 'single', disabled: (value) => isAfter(value, new Date()) }}
							/>

							<SelectFieldControl
								label='Loại hình làm việc'
								name='workType'
								datalist={[
									{ value: 'full-time', label: 'Toàn thời gian' },
									{ value: 'part-time', label: 'Bán thời gian' },
									{ value: 'contract', label: 'Hợp đồng' }
								]}
								labelField='label'
								valueField='value'
							/>
						</Div>
					</Div>

					{/* Additional Information Section */}
					<Div className='space-y-6'>
						<Typography className='text-lg font-semibold'>Thông tin bổ sung</Typography>
						<TextareaFieldControl
							label='Địa chỉ'
							name='address'
							placeholder='Nhập địa chỉ đầy đủ'
							description='Địa chỉ nơi ở của nhân viên, bao gồm số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố'
							orientation='vertical'
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
											key={skill}
											control={form.control}
											name='skills'
											render={({ field }) => {
												return (
													<FormItem key={skill} className='flex flex-row items-start space-y-0 space-x-3'>
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
							label='Ghi chú'
							name='notes'
							placeholder='Thêm ghi chú về nhân viên...'
							description='Thông tin bổ sung hoặc ghi chú đặc biệt về nhân viên'
							orientation='vertical'
						/>
					</Div>

					<Button type='submit' className='w-full'>
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
