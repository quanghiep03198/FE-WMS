import { CommonActions } from '@/common/constants/enums'
import { IDefectiveGoods } from '@/common/types/entities'
import {
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Div,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Icon,
	Input,
	Typography
} from '@/components/ui'
import Pagination from '@/components/ui/@custom/pagination'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { formatRelative } from 'date-fns'
import { enUS, vi, zhCN } from 'date-fns/locale'
import { omit } from 'lodash'
import { Fragment, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { DefectiveCategoryI18n } from '../-constants'
import { usePageContext } from '../-contexts/page-context'
import { useDeleteDefectiveGoodsMutation, useGetDefectiveGoodsQuery } from '../-hooks/use-defective-goods-asm'
import EmptySection from './emtpy-section'

const DefectiveGoodList = () => {
	const { data } = useGetDefectiveGoodsQuery()

	return (
		<Div className='flex h-full flex-col items-stretch gap-y-4 p-4'>
			<Div className='flex h-9 items-center space-x-2 overflow-clip rounded-md border px-2 focus-within:border-primary'>
				<Icon name='Search' />
				<Input placeholder='Scan EPC to search specific item ...' className='border-none px-0 shadow-none' />
			</Div>

			{Array.isArray(data?.data) && data?.totalDocs > 0 ? (
				<ScrollShadow className='h-full w-full flex-1 space-y-4 !overflow-y-scroll pr-2'>
					{data.data.map((item) => {
						return <DefectiveGoodsItem key={item.id} data={item} />
					})}
				</ScrollShadow>
			) : (
				<EmptySection />
			)}
			<Pagination {...omit(data, ['data'])} />
		</Div>
	)
}

const DefectiveGoodsItem: React.FC<{ data: IDefectiveGoods }> = ({ data }) => {
	const { t, i18n } = useTranslation()
	const { event$ } = usePageContext()
	const { mutateAsync: deleteAsync } = useDeleteDefectiveGoodsMutation()
	const toastIdRef = useRef<string | number | null>(null)

	const locale = useMemo(() => {
		switch (i18n.language) {
			case 'vi':
				return vi
			case 'cn':
				return zhCN
			case 'en':
				return enUS
			default:
				return vi // Fallback to Vietnamese if no match
		}
	}, [i18n.language])

	const handleDelete = useCallback(async () => {
		try {
			toastIdRef.current = toast.loading(t('ns_common:notification.processing_request'))
			await deleteAsync(data.id)
			toast.success(t('ns_common:notification.success'), { id: toastIdRef.current })
		} catch {
			toast.error(t('ns_common:notification.error'), { id: toastIdRef.current })
		}
	}, [data])

	return (
		<Fragment>
			<Card className='relative overflow-hidden rounded-md border transition-colors duration-200 @container/card *:text-left *:text-sm'>
				<CardHeader>
					<DropdownMenu>
						<DropdownMenuTrigger className='absolute right-3 top-3 aspect-square size-6 place-content-center place-items-center rounded hover:bg-accent'>
							<Icon name='Ellipsis' />
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenu>
								<DropdownMenuItem
									className='gap-x-2'
									onClick={() =>
										event$.emit({ action: CommonActions.READ, payload: data.defect_description })
									}>
									<Icon name='ArrowUpRight' /> {t('ns_common:actions.detail')}
								</DropdownMenuItem>
								<DropdownMenuItem
									className='gap-x-2'
									onClick={() => event$.emit({ action: CommonActions.UPDATE, payload: data })}>
									<Icon name='PencilLine' /> {t('ns_common:actions.update')}
								</DropdownMenuItem>
								<DropdownMenuItem className='gap-x-2 text-destructive' onClick={() => handleDelete()}>
									<Icon name='Trash2' /> {t('ns_common:actions.delete')}
								</DropdownMenuItem>
							</DropdownMenu>
						</DropdownMenuContent>
					</DropdownMenu>
					<Div className='!mb-3 flex items-center gap-x-1'>
						<Badge>{data.brand_name}</Badge>
						<Badge variant='outline' className='w-fit'>
							{t(DefectiveCategoryI18n[data.category], { ns: 'ns_inoutbound' })}
						</Badge>
					</Div>
					<CardTitle className='inline-flex items-center gap-x-1'>#ID: {data.epc}</CardTitle>
					<CardDescription className='first-letter:uppercase'>
						{t('ns_common:timestamps.created_at', {
							timestamp: formatRelative(new Date(data.created), new Date(), { locale: locale }),
							defaultValue: formatRelative(new Date(data.created), new Date(), { locale: locale })
						})}
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<DescriptionList>
						<DescriptionItem>
							<Icon name='Album' />
							<Typography variant='small'>{t('ns_erp:fields.shoestyle_codefactory')}:</Typography>
							<Typography variant='small'>{data.factory_shoes_style}</Typography>
						</DescriptionItem>
						<DescriptionItem>
							<Icon name='Palette' />
							<Typography variant='small'>{t('ns_erp:fields.color_sn')}:</Typography>
							<Typography variant='small'>{data.color_sn}</Typography>
						</DescriptionItem>
						<DescriptionItem>
							<Icon name='Ruler' />
							<Typography variant='small'>Size: </Typography>
							<Typography variant='small'>#{data.size_code}</Typography>
						</DescriptionItem>
						<DescriptionItem>
							<Icon name='MapPinHouse' />
							<Typography variant='small'>{t('ns_warehouse:fields.storage_position')} : </Typography>
							<Typography className='uppercase'>{data.storage_location}</Typography>
						</DescriptionItem>
						{data.po && (
							<DescriptionItem>
								<Icon name='ReceiptText' />
								<Typography>{t('ns_erp:fields.po')}: </Typography>
								<Typography>{data.po}</Typography>
							</DescriptionItem>
						)}
						{data.mo_no && (
							<DescriptionItem>
								<Icon name='ReceiptText' />
								<Typography>{t('ns_erp:fields.mo_no')}: </Typography>
								<Typography>{data.mo_no}</Typography>
							</DescriptionItem>
						)}
					</DescriptionList>
				</CardContent>
			</Card>
		</Fragment>
	)
}

const DescriptionList = tw.ul`grid @lg/card:items-center grid-cols-1 gap-x-6 gap-y-3 @lg/card:grid-cols-2 items-start`
const DescriptionItem = tw.li`flex items-center gap-x-1 *:text-sm [&_*:last-child]:!font-medium whitespace-nowrap`

export default DefectiveGoodList
