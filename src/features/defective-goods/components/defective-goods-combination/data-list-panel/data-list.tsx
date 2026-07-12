import { Div, Icon } from '@/components/ui'
import type Pagination from '@/components/ui/@custom/pagination'
import type { IDefectiveGoods } from '@/features/defective-goods/services/defective-goods.service'
import type { UseQueryResult } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import React from 'react'
import EmptySection from './emtpy-section'
import InfoCard from './info-card'

type DataListProps = Pick<UseQueryResult<Pagination<IDefectiveGoods>, AxiosError<unknown, any>>, 'data' | 'isLoading'>

const DataList: React.FC<DataListProps> = ({ isLoading, data }) => {
	return isLoading ? (
		<Div className='h-full flex-1 place-content-center place-items-center'>
			<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' size={18} />
		</Div>
	) : Array.isArray(data?.data) && data?.totalDocs > 0 ? (
		<Div className='space-y-4 overflow-y-scroll p-4 group-data-[state=open]:p-0'>
			{data.data.map((item) => {
				return <InfoCard key={item.id} data={item} />
			})}
		</Div>
	) : (
		<EmptySection />
	)
}

DataList.displayName = 'DataList'

export default DataList
