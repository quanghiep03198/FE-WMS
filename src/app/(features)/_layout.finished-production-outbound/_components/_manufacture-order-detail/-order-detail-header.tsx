import { Input, TableHead, TableHeader, TableRow } from '@/components/ui'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { OrderItem } from '../../_types'

type OrderSizeHeaderProps = {
	onColumnFilterChange: React.Dispatch<React.SetStateAction<Omit<OrderItem, 'sizes' | 'factory_code_produce'>>>
}

const OrderDetailTableHeader: React.FC<OrderSizeHeaderProps> = ({ onColumnFilterChange }) => {
	const { t } = useTranslation()

	return (
		<TableHeader className='sticky top-0 z-20'>
			<TableRow className='sticky top-0 *:bg-table-head'>
				<TableHead
					align='left'
					className='z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] whitespace-normal xl:sticky xl:left-0'>
					<span className='line-clamp-1' title={t('ns_erp:fields.mo_no')}>
						{t('ns_erp:fields.mo_no')}
					</span>
				</TableHead>
				<TableHead
					align='left'
					className='z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] whitespace-normal xl:sticky xl:left-[var(--sticky-left-col-width)]'>
					<span className='line-clamp-1' title={t('ns_erp:fields.shoestyle_codefactory')}>
						{t('ns_erp:fields.shoestyle_codefactory')}
					</span>
				</TableHead>
				<TableHead
					align='left'
					className='z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] whitespace-normal border-r-0 !drop-shadow-[1px_0px_hsl(var(--border))] xl:sticky xl:left-[calc(2*var(--sticky-left-col-width))]'>
					<span className='line-clamp-1' title={t('ns_erp:fields.mat_ecolor')}>
						{t('ns_erp:fields.mat_ecolor')}
					</span>
				</TableHead>
				<TableHead align='left' className='border-x-0' title='Size'>
					Size
				</TableHead>
				<TableHead
					align='right'
					className='z-20 w-28 min-w-28 bg-background xl:sticky xl:right-[var(--row-action-col-width)]'
					title={t('ns_common:common_fields.total')}>
					{t('ns_common:common_fields.total')}
				</TableHead>
				<TableHead
					align='center'
					className='z-20 w-[var(--row-action-col-width)] min-w-[var(--row-action-col-width)] bg-background xl:sticky xl:right-0'
					title={t('ns_common:common_fields.actions')}>
					<span className='line-clamp-1'>-</span>
				</TableHead>
			</TableRow>
			{/* Column Filters */}
			<TableRow className='sticky'>
				<TableHead
					align='center'
					className='z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] xl:sticky xl:left-0'>
					<Input
						role='textbox'
						placeholder='Search ...'
						className='w-full border-none font-normal shadow-none'
						onChange={(e) => onColumnFilterChange((prev) => ({ ...prev, mo_no: e.target.value }))}
					/>
				</TableHead>
				<TableHead
					align='center'
					className='z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] xl:sticky xl:left-[var(--sticky-left-col-width)]'>
					<Input
						role='textbox'
						placeholder='Search ...'
						className='w-full border-none font-normal shadow-none'
						onChange={(e) =>
							onColumnFilterChange((prev) => ({ ...prev, shoes_style_code_factory: e.target.value }))
						}
					/>
				</TableHead>
				<TableHead
					align='center'
					className='z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] drop-shadow-[1px_0px_hsl(var(--border))] xl:sticky xl:left-[calc(2*var(--sticky-left-col-width))]'>
					<Input
						role='textbox'
						placeholder='Search ...'
						className='w-full border-none font-normal shadow-none'
						onChange={(e) =>
							onColumnFilterChange((prev) => ({
								...prev,
								mat_ecolor: e.target.value
							}))
						}
					/>
				</TableHead>
				<TableHead className='p-0'>
					<span className='sr-only'></span>
				</TableHead>
				<TableHead
					align='center'
					className='z-20 w-28 min-w-28 border-r-0 drop-shadow-[1px_0px_hsl(var(--border))] xl:sticky xl:right-[var(--row-action-col-width)]'>
					<span className='sr-only'></span>
				</TableHead>
				<TableHead
					align='center'
					className='z-20 w-[var(--row-action-col-width)] min-w-[var(--row-action-col-width)] bg-background xl:sticky xl:right-0'>
					<span className='sr-only'></span>
				</TableHead>
			</TableRow>
		</TableHeader>
	)
}

export default memo(OrderDetailTableHeader)
