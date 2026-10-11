import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import { DatePickerFieldControl } from '@components/forms/date-picker'
import { GhostButton } from '@components/shared/ghost-button'
import { Button } from '@components/ui/button'
import { Form as FormProvider } from '@components/ui/form'
import { Icon } from '@components/ui/icon'
import { Input } from '@components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { Separator } from '@components/ui/separator'
import { useGetProductSpecsQuery } from '@features/product-specification/hooks/use-product-specs-request'
import useQueryParams from '@hooks/use-query-params'
import { PopoverClose } from '@radix-ui/react-popover'
import { useDebounceEffect, useResetState, useSessionStorageState, useSize } from 'ahooks'
import { format, isAfter } from 'date-fns'
import { isEmpty } from 'lodash-es'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import PurchaseOrderFieldControl from '../../../../rfid-agent/components/playground/purchase-order-field-control'
import type { DefectiveCategory } from '../../../constants/enums'
import { PERSISTENT_DEFECTIVE_GOODS_SEARCH_TERMS_KEY } from '../../../constants/storage-keys'
import type { DefectiveGoodQueryParams } from '../../../schemas/defective-goods.schema'
import AssemblyLineFieldControl from '../form-playground/assembly-line-field-control'
import BrandFieldControl from '../form-playground/brand-field-control'
import CategoryFieldControl from '../form-playground/category-field-control'
import ColorFieldControl from '../form-playground/color-field-control'
import CommandNumberFieldControl from '../form-playground/command-number-field-control'
import CustShoeStyleFieldControl from '../form-playground/cust-shoe-style-field-control'
import FactoryShoeStyleFieldControl from '../form-playground/factory-shoe-style-field-control'
import SewingLineFieldControl from '../form-playground/sewing-line-field-control'
import SizeFieldControl from '../form-playground/size-field-control'

const DEFAULT_SEARCH_TERMS: Omit<DefectiveGoodQueryParams, 'page'> = {
	brand_name: '',
	defective_category: '' as DefectiveCategory,
	po: '',
	mo_no: '',
	cust_shoes_style: '',
	factory_shoes_style: '',
	color_sn: '',
	size_code: '',
	epc: ''
}

const SearchBox: React.FC = () => {
	const { setParams } = useQueryParams<{ page: number }>()
	const [searchTerms, setSearchTerms] = useSessionStorageState<Omit<DefectiveGoodQueryParams, 'page'>>(
		PERSISTENT_DEFECTIVE_GOODS_SEARCH_TERMS_KEY,
		{
			listenStorageChange: true,
			defaultValue: DEFAULT_SEARCH_TERMS
		}
	)
	const [epcSearchTerm, setEpcSearchTerm, resetEpcSearchTerm] = useResetState<string>(searchTerms.epc ?? '')
	const { t } = useTranslation()
	const { data: productSpecification, isLoading } = useGetProductSpecsQuery()
	const form = useForm<DefectiveGoodQueryParams>({
		defaultValues: searchTerms
	})
	const ref = useRef<HTMLDivElement>(null)
	const size = useSize(ref)

	const handleEpcChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		setEpcSearchTerm(e.currentTarget.value.toUpperCase())
	}

	useDebounceEffect(
		() => {
			setSearchTerms({ ...searchTerms, epc: epcSearchTerm })
		},
		[epcSearchTerm],
		{ wait: 200 }
	)

	const handleSearchSubmission = (data: DefectiveGoodQueryParams): void => {
		setSearchTerms({
			...data,
			...(data.created && { created: format(new Date(data.created), 'yyyy-MM-dd') })
		})
		setParams({ page: 1 })
	}

	const handleResetAllSearchTerms = () => {
		form.reset(DEFAULT_SEARCH_TERMS)
		resetEpcSearchTerm()
		setSearchTerms(DEFAULT_SEARCH_TERMS)
	}

	const formFieldOrientation: 'horizontal' | 'vertical' = size?.width >= 480 ? 'horizontal' : 'vertical'
	const isFilterDirty = Object.values(searchTerms).some((value) => !isEmpty(value))

	return (
		<Div className='flex h-full w-full items-center space-x-2' ref={ref}>
			<Icon className='basis-6' name='Search' />
			<Input
				className='border-none px-0 shadow-none'
				placeholder={t('ns_rfid:placeholders.search_epc')}
				type='text'
				value={epcSearchTerm}
				onChange={handleEpcChange}
				onKeyDown={(e) => {
					if (e.key === 'Backspace') resetEpcSearchTerm()
				}}
			/>
			<GhostButton
				className={cn(
					'transition-allow-discrete duration-300',
					isFilterDirty ? 'animate-in fade-in-0' : 'animate-out fade-out-0 hidden'
				)}
				onClick={handleResetAllSearchTerms}>
				<Icon name='X' />
			</GhostButton>
			<Separator
				orientation='vertical'
				className={cn(
					'transition-allow-discrete mx-1 w-0.5 duration-300',
					isFilterDirty ? 'animate-in fade-in-0' : 'animate-out fade-out-0 hidden'
				)}
			/>
			<FormProvider {...{ ...form, productSpecification }}>
				<Popover>
					<PopoverTrigger className='text-muted-foreground aria-expanded:text-active hover:text-foreground aria-expanded:hover:text-active aspect-square transition-colors duration-200'>
						<Icon name='ListFilter' />
					</PopoverTrigger>
					<PopoverContent
						align='end'
						alignOffset={-8}
						className='relative'
						sideOffset={20}
						style={{ width: size?.width + 16 }}>
						<PopoverClose className='text-muted-foreground hover:text-foreground absolute top-4 right-4 transition-colors duration-200'>
							<Icon name='X' />
						</PopoverClose>
						<form
							className={cn('space-y-6', isLoading && 'opacity-50')}
							onSubmit={form.handleSubmit(handleSearchSubmission)}>
							<fieldset className='space-y-6'>
								<legend className='text-base font-semibold'>{t('ns_common:titles.advanced_search')}</legend>
								<Div
									className={cn(
										'scroll-fade grid max-h-96 scrollbar-none overflow-y-auto',
										formFieldOrientation === 'horizontal' ? 'gap-y-3' : 'gap-y-6'
									)}>
									<DatePickerFieldControl
										calendarProps={{ disabled: (value) => isAfter(value, new Date()) }}
										label={t('ns_common:common_fields.created_at')}
										name='created'
										orientation={formFieldOrientation}
									/>
									<CategoryFieldControl orientation={formFieldOrientation} />
									<BrandFieldControl orientation={formFieldOrientation} />
									<CustShoeStyleFieldControl orientation={formFieldOrientation} />
									<FactoryShoeStyleFieldControl orientation={formFieldOrientation} />
									<PurchaseOrderFieldControl orientation={formFieldOrientation} />
									<CommandNumberFieldControl orientation={formFieldOrientation} />
									<ColorFieldControl orientation={formFieldOrientation} />
									<SizeFieldControl name='size_code' orientation={formFieldOrientation} />
									<SewingLineFieldControl orientation={formFieldOrientation} />
									<AssemblyLineFieldControl orientation={formFieldOrientation} />
								</Div>
							</fieldset>
							<fieldset className='flex items-center justify-end gap-x-2'>
								<Button size='sm' type='submit'>
									<Icon name='Search' />
									{t('ns_common:actions.search')}
								</Button>
								<Button
									size='sm'
									type='reset'
									variant='secondary'
									onClick={() => {
										form.reset(DEFAULT_SEARCH_TERMS)
										resetEpcSearchTerm()
										setSearchTerms(DEFAULT_SEARCH_TERMS)
									}}>
									<Icon name='Undo2' />
									{t('ns_common:actions.reset')}
								</Button>
							</fieldset>
						</form>
					</PopoverContent>
				</Popover>
			</FormProvider>
		</Div>
	)
}

export default SearchBox
