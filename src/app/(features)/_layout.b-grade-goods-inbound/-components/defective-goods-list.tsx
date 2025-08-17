import { FALLBACK_VALUE } from '@/common/constants/constants'
import { Div, Icon, Input, Typography } from '@/components/ui'
import Pagination from '@/components/ui/@custom/pagination'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { useTranslation } from 'react-i18next'
import { useGetDefectiveGoodsQuery } from '../-hooks/use-defective-goods-asm'
import EmptySection from './emtpy-section'

type Props = {}

const DefectiveGoodList = (props: Props) => {
	const { data } = useGetDefectiveGoodsQuery()
	const { t } = useTranslation()

	return (
		<Div className='flex h-full flex-col items-stretch gap-y-4 p-4'>
			<Div className='flex h-9 items-center space-x-2 overflow-clip rounded-md border px-2 focus-within:border-primary'>
				<Icon name='Search' />
				<Input placeholder='Scan EPC to search specific item ...' className='border-none px-0 shadow-none' />
			</Div>

			{Array.isArray(data?.data) && data?.totalDocs > 0 ? (
				<ScrollShadow className='h-full w-full flex-1 !overflow-y-scroll'>
					{data.data.map((item) => {
						return (
							<Div
								key={item.id}
								className='rounded-md border p-4 transition-colors duration-200 *:text-left *:text-sm hover:bg-accent/50'>
								<Div className='grid grid-cols-2 gap-x-4'>
									<ul className='flex w-full list-disc flex-col gap-y-1 [&_li]:flex [&_li]:items-center [&_li]:gap-x-2'>
										<li>
											<Typography>{t('ns_erp:fields.brand_name')}:</Typography>
											<Typography className='font-medium'>{item.brand_name}</Typography>
										</li>
										<li>
											<Typography>{t('ns_erp:fields.shoestyle_codefactory')}:</Typography>
											<Typography className='font-medium'>{item.factory_shoes_style}</Typography>
										</li>
										<li>
											<Typography>{t('ns_erp:fields.color_sn')}:</Typography>
											<Typography className='font-medium'>{item.color_sn}</Typography>
										</li>
										<li>
											<Typography>Size: </Typography>
											<Typography className='font-medium'>{item.size_code}</Typography>
										</li>
									</ul>
									<ul className='flex list-disc flex-col gap-y-1 [&_li]:flex [&_li]:items-center [&_li]:gap-x-2'>
										<li>
											<Typography>{t('ns_erp:fields.po')}: </Typography>
											<Typography className='font-medium'>{item.po ?? FALLBACK_VALUE}</Typography>
										</li>
										<li>
											<Typography>{t('ns_erp:fields.mo_no')}: </Typography>
											<Typography className='font-medium'>{item.mo_no ?? FALLBACK_VALUE}</Typography>
										</li>
										<li>
											<Typography>{t('ns_erp:fields.category')}: </Typography>
											<Typography className='font-medium'>
												{t(`ns_inoutbound:shoes_category.${item.category}` as Parameter<typeof t>)}
											</Typography>
										</li>
										<li>
											<Typography>{t('ns_warehouse:fields.storage_num')}: </Typography>
											<Typography className='font-medium'>{item.storage_location}</Typography>
										</li>
									</ul>
								</Div>
							</Div>
						)
					})}
				</ScrollShadow>
			) : (
				<EmptySection />
			)}

			<Pagination {...data} />
		</Div>
	)
}

export default DefectiveGoodList
