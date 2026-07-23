import { Div, Icon, TableBody, TableCell, TableRow } from '@components/ui'
import React from 'react'

const DataTableEmpty: React.FC<{ colSpan: number }> = ({ colSpan }) => {
	return (
		<TableBody className='h-[calc(100cqh-var(--row-height)*2-1px)]'>
			<TableRow>
				<TableCell colSpan={colSpan} className='p-0'>
					<Div className='text-muted-foreground sticky top-0 left-0 flex w-[100cqw] items-center justify-center gap-x-2'>
						<Icon name='Database' strokeWidth={1} size={32} /> No data
					</Div>
				</TableCell>
			</TableRow>
		</TableBody>
	)
}

export default DataTableEmpty
