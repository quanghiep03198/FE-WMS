import { Input, TableHead, TableHeader, TableRow } from '@/components/ui'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import type { OrderItem } from '../../..'

type OrderSizeHeaderProps = {
	onColumnFilterChange: React.Dispatch<React.SetStateAction<Omit<OrderItem, 'sizes' | 'factory_code_produce'>>>
}

const OrderDetailTableHeader: React.FC<OrderSizeHeaderProps> = ({ onColumnFilterChange }) => {
	const { t } = useTranslation()

	return (
		<TableHeader className='sticky top-0 z-20'>
			<TableRow className='sticky top-0 *:bg-table-head [&>th>span]:capitalize'>
				<TableHead align='left'>
					<span className='line-clamp-1' title={t('ns_erp:fields.mo_no')}>
						{t('ns_erp:fields.mo_no')}
					</span>
				</TableHead>
				<TableHead align='left'>
					<span className='line-clamp-1' title={t('ns_erp:fields.factory_shoes_style')}>
						{t('ns_erp:fields.factory_shoes_style')}
					</span>
				</TableHead>
				<TableHead align='left'>
					<span className='line-clamp-1' title={t('ns_erp:fields.color_sn')}>
						{t('ns_erp:fields.color_sn')}
					</span>
				</TableHead>
				<TableHead align='left' className='border-x-0 p-0' title='Size'>
					<span className='left-[calc(3*var(--sticky-left-col-width))] block w-full px-4 py-2 text-center @3xl:sticky @4xl:w-[calc(100cqw-3*var(--sticky-left-col-width)-var(--sticky-right-col-width)-var(--row-action-col-width))]'>
						Size
					</span>
				</TableHead>
				<TableHead align='right' title={t('ns_common:common_fields.total')}>
					<span className='line-clamp-1'>{t('ns_common:common_fields.total')}</span>
				</TableHead>
				<TableHead align='center' title={t('ns_common:common_fields.actions')}>
					<span className='line-clamp-1'>-</span>
				</TableHead>
			</TableRow>
			{/* Column Filters */}
			<TableRow className='sticky'>
				<TableHead align='center'>
					<Input
						role='textbox'
						placeholder='Search ...'
						className='w-full border-none font-normal shadow-none transition-none'
						onChange={(e) => onColumnFilterChange((prev) => ({ ...prev, mo_no: e.target.value }))}
					/>
				</TableHead>
				<TableHead align='center'>
					<Input
						role='textbox'
						placeholder='Search ...'
						className='w-full border-none font-normal shadow-none transition-none'
						onChange={(e) => onColumnFilterChange((prev) => ({ ...prev, factory_shoes_style: e.target.value }))}
					/>
				</TableHead>
				<TableHead align='center'>
					<Input
						role='textbox'
						placeholder='Search ...'
						className='w-full border-none font-normal shadow-none transition-none'
						onChange={(e) =>
							onColumnFilterChange((prev) => ({
								...prev,
								color_sn: e.target.value
							}))
						}
					/>
				</TableHead>
				<TableHead className='p-0'>
					<span className='sr-only'></span>
				</TableHead>
				<TableHead align='center'>
					<span className='sr-only'></span>
				</TableHead>
				<TableHead align='center'>
					<span className='sr-only'></span>
				</TableHead>
			</TableRow>
		</TableHeader>
	)
}

export default memo(OrderDetailTableHeader)
