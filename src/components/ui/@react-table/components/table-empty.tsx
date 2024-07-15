import React from 'react'
import { Div, Icon } from '@/components/ui'

const TableEmpty: React.FC = () => {
	return (
		<Div
			role='contentinfo'
			className='sticky left-0 top-0 flex h-full w-full flex-1 items-center justify-center bg-background'>
			<Div className='flex items-center justify-center gap-x-2 text-muted-foreground'>
				<Icon name='Database' strokeWidth={1} size={32} /> No data
			</Div>
		</Div>
	)
}

export default TableEmpty
