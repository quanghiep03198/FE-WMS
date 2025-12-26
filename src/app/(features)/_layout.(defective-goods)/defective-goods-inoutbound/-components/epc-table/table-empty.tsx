import { Div, Icon, TableBody, TableCell, TableRow } from '@/components/ui'
import React from 'react'

const DataTableEmpty: React.FC<{ colSpan: number }> = ({ colSpan }) => {
	return (
		<TableBody className='h-[calc(var(--outlet-wrapper-height)-var(--header-height)-var(--row-height)*2)]'>
			<TableRow>
				<TableCell colSpan={colSpan} className='p-0'>
					<Div className='sticky left-0 top-0 flex items-center justify-center gap-x-2 text-muted-foreground'>
						<Icon name='Database' strokeWidth={1} size={32} /> No data
					</Div>
				</TableCell>
			</TableRow>
		</TableBody>
	)
}

export default DataTableEmpty
