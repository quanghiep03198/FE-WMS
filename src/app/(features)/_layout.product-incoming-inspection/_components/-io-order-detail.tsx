import { Badge, Div, DivProps, Typography } from '@/components/ui'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

const IOSubOrderRow: React.FC<{ data: any }> = ({ data }) => {
	const { t } = useTranslation()

	return (
		<List role='subrow'>
			<ListItem role='row'>
				<Typography className='whitespace-nowrap text-sm font-medium' role='cell'>
					{t('ns_erp:fields.sno_no')}
				</Typography>
				<Badge variant='secondary' role='cell'>
					-
				</Badge>
			</ListItem>
			<ListItem role='row'>
				<Typography className='whitespace-nowrap text-sm font-medium' role='cell'>
					{t('ns_erp:fields.container_order_code')}
				</Typography>
				<Badge variant='secondary' role='cell'>
					-
				</Badge>
			</ListItem>
			<ListItem role='row'>
				<Typography className='whitespace-nowrap text-sm font-medium' role='cell'>
					{t('ns_erp:fields.order_qty')}
				</Typography>
				<Badge variant='secondary' role='cell'>
					-
				</Badge>
			</ListItem>
			<ListItem role='row'>
				<Typography className='whitespace-nowrap text-sm font-medium' role='cell'>
					{t('ns_erp:fields.order_qty')}
				</Typography>
				<Badge variant='secondary' role='cell'>
					-
				</Badge>
			</ListItem>
			<ListItem role='row'>
				<Typography className='whitespace-nowrap text-sm font-medium' role='cell'>
					{t('ns_erp:fields.conversion_rate')}
				</Typography>
				<Badge variant='secondary' role='cell'>
					-
				</Badge>
			</ListItem>
			<ListItem role='row'>
				<Typography className='whitespace-nowrap text-sm font-medium' role='cell'>
					{t('ns_erp:fields.required_date')}
				</Typography>
				<Badge variant='secondary' role='cell'>
					-
				</Badge>
			</ListItem>
			<ListItem role='row'>
				<Typography className='whitespace-nowrap text-sm font-medium' role='cell'>
					{t('ns_erp:fields.uninspected_qty')}
				</Typography>
				<Badge variant='secondary' role='cell'>
					-
				</Badge>
			</ListItem>
			<ListItem role='row'>
				<Typography className='whitespace-nowrap text-sm font-medium'>
					{t('ns_erp:fields.inspected_qty')}
				</Typography>
				<Badge variant='secondary'>-</Badge>
			</ListItem>
			<ListItem role='row'>
				<Typography className='whitespace-nowrap text-sm font-medium' role='cell'>
					{t('ns_warehouse:fields.type_warehouse')}
				</Typography>
				<Badge variant='secondary' role='cell'>
					-
				</Badge>
			</ListItem>
			<ListItem role='row' className='col-span-full grid-cols-[1fr_5fr] gap-x-0'>
				<Typography className='whitespace-nowrap text-sm font-medium' role='cell'>
					{t('ns_common:common_fields.remark')}
				</Typography>
				<Div className='h-24 rounded-lg border p-2' role='cell'>
					-
				</Div>
			</ListItem>
		</List>
	)
}

export default memo(IOSubOrderRow)

const List = tw(Div)<DivProps>`grid grid-cols-3 gap-y-2 gap-x-4 overflow-auto scrollbar-none w-full sticky left-4`
const ListItem = tw(Div)<DivProps>`grid grid-cols-2 whitespace-nowrap gap-x-4`
