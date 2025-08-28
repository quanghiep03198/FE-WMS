import { CommonActions } from '@/common/constants/enums'
import useCopyToClipboard from '@/common/hooks/use-copy-to-clipboard'
import { useDateLocale } from '@/common/hooks/use-date-locale'
import { IDefectiveGoods } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
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
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTrigger,
	Tooltip,
	Typography
} from '@/components/ui'
import Pagination from '@/components/ui/@custom/pagination'
import { Link, useLocation } from '@tanstack/react-router'
import { formatRelative } from 'date-fns'
import { omit } from 'lodash'
import { Fragment, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { DefectiveCategoryI18n } from '../../-constants'
import { usePageContext } from '../../-contexts/page-context'
import { useDeleteDefectiveGoodsMutation, useGetDefectiveGoodsQuery } from '../../-hooks/use-defective-goods-asm'
import { useSwitchRFIDDevice } from '../../-hooks/use-switch-rfid-device'
import EmptySection from './emtpy-section'
import SearchInput from './search-input'

const DefectiveGoodList: React.FC = () => {
	const { data } = useGetDefectiveGoodsQuery()

	return (
		<Fragment>
			<Div className='hidden h-full flex-col items-stretch gap-y-4 p-4 @7xl:flex'>
				<SearchInput />
				{Array.isArray(data?.data) && data?.totalDocs > 0 ? (
					<Div className='flex h-full w-full flex-1 flex-col items-stretch gap-y-4 !overflow-y-scroll pr-2'>
						{data.data.map((item) => {
							return <DefectiveGoodsItem key={item.id} data={item} />
						})}
					</Div>
				) : (
					<EmptySection />
				)}
				<Pagination {...omit(data, ['data'])} />
			</Div>
			<Sheet defaultOpen={false}>
				<SheetTrigger className='hidden' id='list-sheet-trigger' />
				<SheetContent className='max-w-2xl overflow-hidden'>
					<SheetHeader className='mt-4'>
						<SearchInput />
					</SheetHeader>
					{Array.isArray(data?.data) && data?.totalDocs > 0 ? (
						<Div className='flex h-full w-full flex-1 flex-col items-stretch gap-y-4 !overflow-y-scroll pr-2'>
							{data.data.map((item) => {
								return <DefectiveGoodsItem key={item.id} data={item} />
							})}
						</Div>
					) : (
						<EmptySection />
					)}
					<SheetFooter>
						<Pagination {...omit(data, ['data'])} />
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</Fragment>
	)
}

const DefectiveGoodsItem: React.FC<{ data: IDefectiveGoods }> = ({ data }) => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const { mutateAsync: deleteAsync } = useDeleteDefectiveGoodsMutation()
	const toastIdRef = useRef<string | number | null>(null)
	const { hash, search } = useLocation()
	const dateLocale = useDateLocale()
	const { setCurrentDevice } = useSwitchRFIDDevice()

	const handleDelete = useCallback(async () => {
		try {
			toastIdRef.current = toast.loading(t('ns_common:notification.processing_request'))
			await deleteAsync(data.id)
			toast.success(t('ns_common:notification.success'), { id: toastIdRef.current })
		} catch {
			toast.error(t('ns_common:notification.error'), { id: toastIdRef.current })
		}
	}, [data])

	const [copyToClipboard, { isCoppied }] = useCopyToClipboard()

	return (
		<Link search={search} hash={data.id}>
			<Card
				className={cn(
					'relative overflow-hidden rounded-md border transition-colors duration-200 @container/card *:text-left *:text-sm',
					hash === String(data.id) && 'bg-accent/50'
				)}>
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
									<Icon name='MousePointerClick' /> {t('ns_common:actions.detail')}
								</DropdownMenuItem>
								<DropdownMenuItem
									className='gap-x-2'
									onClick={() => {
										event$.emit({ action: CommonActions.UPDATE, payload: data })
										setCurrentDevice('usb')
									}}>
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
					<CardTitle className='group/cart-title inline-flex items-center gap-x-1'>
						#ID: {data.epc}{' '}
						<Tooltip message='Copy' triggerProps={{ asChild: true }}>
							<button onClick={() => copyToClipboard(data.epc)} className={cn('ml-2')}>
								<Icon name={isCoppied ? 'CopyCheck' : 'Copy'} />
							</button>
						</Tooltip>
					</CardTitle>
					<CardDescription className='first-letter:uppercase'>
						{t('ns_common:timestamps.created_at', {
							timestamp: formatRelative(new Date(data.created), new Date(), { locale: dateLocale }),
							defaultValue: formatRelative(new Date(data.created), new Date(), { locale: dateLocale })
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
							<Icon name='RulerDimensionLine' />
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
		</Link>
	)
}

const DescriptionList = tw.ul`grid @lg/card:items-center grid-cols-1 gap-x-6 gap-y-3 @lg/card:grid-cols-2 items-start`
const DescriptionItem = tw.li`flex items-center gap-x-1 *:text-sm [&_*:last-child]:!font-medium whitespace-nowrap`

export default DefectiveGoodList
