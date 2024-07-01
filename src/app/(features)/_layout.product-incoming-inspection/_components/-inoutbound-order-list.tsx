import { IInOutBoundOrder } from '@/common/types/entities'
import { createColumnHelper } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {}

const InOutBoundOrderList = (props: Props) => {
	const { t, i18n } = useTranslation()
	const columnHelper = createColumnHelper<IInOutBoundOrder>()

	const columns = useMemo(() => [columnHelper.accessor('', {})], [i18n.language])

	return <div>InOutBoundOrderList</div>
}

export default InOutBoundOrderList
