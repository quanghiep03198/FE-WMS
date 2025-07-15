import useVirutalScrollOffset from '@/common/hooks/use-virtual-scroll-offset'
import { Virtualizer } from '@tanstack/react-virtual'
import React, { Fragment, memo } from 'react'
import { VirtualPlaceholderRow } from './table-row'

type TableBodyVirtualViewportProps = React.PropsWithChildren & {
	virtualizer: Virtualizer<HTMLDivElement, Element>
	columnCount: number
}

const TableBodyVirtualViewport: React.FC<TableBodyVirtualViewportProps> = ({ children, virtualizer, columnCount }) => {
	const { before, after } = useVirutalScrollOffset(virtualizer)

	return (
		<Fragment>
			{before > 0 && <VirtualPlaceholderRow colSpan={columnCount} style={{ height: before }} />}
			{children}
			{after > 0 && <VirtualPlaceholderRow colSpan={columnCount} style={{ height: after }} />}
		</Fragment>
	)
}

export default memo(TableBodyVirtualViewport)
