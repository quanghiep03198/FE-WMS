import { Div } from '@components/customs/div'
import { Icon } from '@components/ui/icon'
import { TableBody, TableCell, TableRow } from '@components/ui/table'
import React from 'react'

const DataTableEmpty: React.FC<{ colSpan: number }> = ({ colSpan }) => {
	return (
		<TableBody className='h-[calc(100cqh-var(--row-height)*2-1px)]'>
			<TableRow>
				<TableCell className='p-0' colSpan={colSpan}>
					<Div className='text-muted-foreground sticky top-0 left-0 flex w-[100cqw] items-center justify-center gap-x-2'>
						<Icon name='Database' size={32} strokeWidth={1} /> No data
					</Div>
				</TableCell>
			</TableRow>
		</TableBody>
	)
}

export default DataTableEmpty
