'use no memo'

import {
	buttonVariants,
	Checkbox,
	Div,
	Icon,
	Input,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Typography
} from '@/components/ui'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Table } from '@tanstack/react-table'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

const GlobalFilter: React.FC<{
	table: Table<ITruckloadDelivery>
	event$: EventEmitter<Record<string, unknown>>
}> = ({ table }) => {
	const { t } = useTranslation()
	const [globalFilterColumns, setGlobalFilterColumns] = useState<string[]>(['license_plate', 'container_number', 'po'])

	const [_value, setValue] = useState(table.getState().globalFilter)

	useEffect(() => {
		setValue(table.getState().globalFilter)
	}, [table.getState().globalFilter])

	useEffect(() => {
		const timeout = setTimeout(() => {
			table.setGlobalFilter(String(_value))
		}, 200)

		return () => clearTimeout(timeout)
	}, [_value])

	const handleSelectColumn = (checked: CheckedState) => {
		setGlobalFilterColumns((prev) => {
			if (checked) return [...new Set([...prev, 'po'])]
			return prev.filter((item) => item !== 'po')
		})
	}

	// TODO: create form allow user filter by multiple columns with different operators (contains, equals, begins with, ends with)

	return (
		<Popover>
			<PopoverTrigger
				className={buttonVariants({
					variant: 'outline',
					className: 'flex-1 !justify-start font-normal xl:flex-none xl:basis-1/2'
				})}>
				<Icon name='ListFilter' />
				<Typography variant='small' color='muted'>
					{t('ns_common:actions.search')} ...
				</Typography>
			</PopoverTrigger>
			<PopoverContent
				align='start'
				className='w-[calc(100svw-16px)] space-y-6 xl:w-[--radix-popover-trigger-width]'
				onOpenAutoFocus={(e) => e.preventDefault()}>
				<Div className='grid grid-cols-3 gap-2 space-y-0.5'>
					{/*  */}
					<Label
						htmlFor='license_plate'
						className={buttonVariants({
							variant: 'ghost',

							className: 'w-full justify-start gap-x-2 text-sm font-normal'
						})}>
						<Checkbox id='license_plate' defaultChecked={true} onCheckedChange={handleSelectColumn} />
						<Icon name='Truck' stroke='hsl(var(--muted-foreground))' />
						{t('ns_erp:fields.license_plate')}
					</Label>
					<Select defaultValue='%:q%' onValueChange={(value) => table.setGlobalFilter(value + _value)}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='%:q%'>Contains</SelectItem>
							<SelectItem value='=:q'>Equals</SelectItem>
							<SelectItem value=':q%'>Begins with</SelectItem>
							<SelectItem value='%:q'>Ends with</SelectItem>
						</SelectContent>
					</Select>
					<Input placeholder={t('ns_common:actions.search') + '...'} />
					{/*  */}
					<Label
						htmlFor='container_number'
						className={buttonVariants({
							variant: 'ghost',

							className: 'w-full justify-start gap-x-2 text-sm font-normal'
						})}>
						<Checkbox id='container_number' defaultChecked={true} onCheckedChange={handleSelectColumn} />
						<Icon name='Container' stroke='hsl(var(--muted-foreground))' />
						{t('ns_erp:fields.container_number')}
					</Label>
					<Select defaultValue='%:q%' onValueChange={(value) => table.setGlobalFilter(value + _value)}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='%:q%'>Contains</SelectItem>
							<SelectItem value='=:q'>Equals</SelectItem>
							<SelectItem value=':q%'>Begins with</SelectItem>
							<SelectItem value='%:q'>Ends with</SelectItem>
						</SelectContent>
					</Select>
					<Input placeholder={t('ns_common:actions.search') + '...'} />
					{/*  */}
					<Label
						htmlFor='po'
						className={buttonVariants({
							variant: 'ghost',

							className: 'w-full justify-start gap-x-2 text-sm font-normal'
						})}>
						<Checkbox id='po' value='po' defaultChecked={true} onCheckedChange={handleSelectColumn} />
						<Icon name='Receipt' stroke='hsl(var(--muted-foreground))' />
						{t('ns_erp:fields.po')}
					</Label>
					<Select defaultValue='%:q%' onValueChange={(value) => table.setGlobalFilter(value + _value)}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='%:q%'>Contains</SelectItem>
							<SelectItem value='=:q'>Equals</SelectItem>
							<SelectItem value=':q%'>Begins with</SelectItem>
							<SelectItem value='%:q'>Ends with</SelectItem>
						</SelectContent>
					</Select>
					<Input placeholder={t('ns_common:actions.search') + '...'} />
				</Div>
			</PopoverContent>
		</Popover>
	)
}

export default GlobalFilter
