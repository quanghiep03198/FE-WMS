import { Div, Icon, Typography } from '@/components/ui'
import React, { useContext } from 'react'
import tw from 'tailwind-styled-components'
import { PageContext } from '../_context/-page-context'
import { cn } from '@/common/utils/cn'

const ScannedEPCsList: React.FC = () => {
	const { data, currentOrderCode } = useContext(PageContext)

	return (
		<Div className='flex h-full flex-col items-stretch divide-y divide-border rounded-[var(--radius)] border border-border md:order-2'>
			<Div className='flex basis-16 items-center justify-center px-4 text-center'>
				<Typography variant='h6' className='relative z-10 inline-flex items-center gap-x-2 text-center text-lg'>
					<Icon name='ScanBarcode' size={24} />
					EPC Data
				</Typography>
			</Div>
			{Array.isArray(data) && data?.length === 0 ? (
				<EmptyList>
					<Icon name='Inbox' stroke='hsl(var(--muted-foreground))' size={32} strokeWidth={1} />
					<Typography color='muted'>Empty</Typography>
				</EmptyList>
			) : (
				<List>
					{Array.isArray(data) &&
						data.map((item) => (
							<ListItem
								className={cn(
									item.mo_no !== currentOrderCode
										? 'bg-destructive text-destructive-foreground hover:opacity-80'
										: 'hover:bg-secondary'
								)}>
								<Typography className='font-medium'>{item?.epc_code}</Typography>
								<Typography
									variant='small'
									className={cn(
										item.mo_no !== currentOrderCode ? 'text-destructive-foreground' : 'text-foreground'
									)}>
									{item?.mo_no}
								</Typography>
							</ListItem>
						))}
				</List>
			)}
		</Div>
	)
}

const List = tw.div`flex max-h-full flex-1 basis-full flex-col items-stretch divide-y divide-border overflow-y-scroll p-2 scrollbar`
const ListItem = tw.div`px-4 py-2 flex justify-between uppercase transition-all duration-200 rounded`
const EmptyList = tw.div`flex basis-full items-center justify-center gap-x-4 min-h-64`

export default ScannedEPCsList
