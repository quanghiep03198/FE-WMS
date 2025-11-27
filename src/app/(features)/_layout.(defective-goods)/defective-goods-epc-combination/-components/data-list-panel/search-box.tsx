import { GhostButton } from '@/app/(features)/-components/-shared/ghost-button'
import { useGetProductSpecificationQuery } from '@/app/(features)/-hooks/use-product-specification-asm'
import useQueryParams from '@/common/hooks/use-query-params'
import { cn } from '@/common/utils/cn'
import {
	Button,
	DatePickerFieldControl,
	Div,
	Form as FormProvider,
	Icon,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Separator
} from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { PopoverClose } from '@radix-ui/react-popover'
import { useDebounceEffect, useResetState, useSessionStorageState, useSize, useUnmount } from 'ahooks'
import { format, isAfter } from 'date-fns'
import { isEmpty } from 'lodash-es'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PERSISTENT_DEFECTIVE_GOODS_SEARCH_TERMS_KEY } from '../../-constants'
import { DefectiveGoodQueryParams } from '../../-schemas/defective-goods.schema'
import { DefectiveCategory } from '../../../-constants'
import BrandFieldControl from '../form-playground/brand-field-control'
import CategoryFieldControl from '../form-playground/category-field-control'
import ColorFieldControl from '../form-playground/color-field-control'
import CommandNumberFieldControl from '../form-playground/command-number-field-control'
import CustShoeStyleFieldControl from '../form-playground/cust-shoe-style-field-control'
import FactoryShoeStyleFieldControl from '../form-playground/factory-shoe-style-field-control'
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
	const { data: productSpecification, isLoading } = useGetProductSpecificationQuery()
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

	useUnmount(() => {
		setSearchTerms(DEFAULT_SEARCH_TERMS)
	})

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
		<Div ref={ref} className='flex h-full w-full items-center space-x-2'>
			<Icon name='Search' className='basis-6' />
			<Input
				placeholder={t('ns_rfid:placeholders.search_epc')}
				className='border-none px-0 shadow-none'
				type='text'
				value={epcSearchTerm}
				onChange={handleEpcChange}
				onKeyDown={(e) => {
					if (e.key === 'Backspace') resetEpcSearchTerm()
				}}
			/>
			<GhostButton
				onClick={handleResetAllSearchTerms}
				className={cn(
					'duration-300 transition-allow-discrete',
					isFilterDirty ? 'animate-in fade-in-0' : 'hidden animate-out fade-out-0'
				)}>
				<Icon name='X' />
			</GhostButton>
			<Separator
				orientation='vertical'
				className={cn(
					'mx-1 w-0.5 duration-300 transition-allow-discrete',
					isFilterDirty ? 'animate-in fade-in-0' : 'hidden animate-out fade-out-0'
				)}
			/>
			<FormProvider {...{ ...form, productSpecification }}>
				<Popover>
					<PopoverTrigger className='aspect-square text-muted-foreground transition-colors duration-200 aria-expanded:text-active hover:text-foreground aria-expanded:hover:text-active'>
						<Icon name='ListFilter' />
					</PopoverTrigger>
					<PopoverContent
						align='end'
						sideOffset={20}
						style={{ width: size?.width + 16 }}
						alignOffset={-8}
						className='relative'>
						<PopoverClose className='absolute right-4 top-4 text-muted-foreground transition-colors duration-200 hover:text-foreground'>
							<Icon name='X' />
						</PopoverClose>
						<form
							className={cn('space-y-6', isLoading && 'opacity-50')}
							onSubmit={form.handleSubmit(handleSearchSubmission)}>
							<fieldset className='space-y-6'>
								<legend className='text-base font-semibold'>{t('ns_common:titles.advanced_search')}</legend>
								<ScrollShadow
									className={cn(
										'grid max-h-96 overflow-y-auto scrollbar-none',
										formFieldOrientation === 'horizontal' ? 'gap-y-3' : 'gap-y-6'
									)}>
									<DatePickerFieldControl
										name='created'
										label={t('ns_common:common_fields.created_at')}
										calendarProps={{ disabled: (value) => isAfter(value, new Date()) }}
										orientation={formFieldOrientation}
									/>
									<CategoryFieldControl orientation={formFieldOrientation} />
									<BrandFieldControl orientation={formFieldOrientation} />
									<CustShoeStyleFieldControl orientation={formFieldOrientation} />
									<FactoryShoeStyleFieldControl orientation={formFieldOrientation} />
									<CommandNumberFieldControl orientation={formFieldOrientation} />
									<ColorFieldControl orientation={formFieldOrientation} />
									<SizeFieldControl orientation={formFieldOrientation} />
								</ScrollShadow>
							</fieldset>
							<fieldset className='flex items-center justify-end gap-x-2'>
								<Button type='submit' size='sm'>
									<Icon name='Search' />
									{t('ns_common:actions.search')}
								</Button>
								<Button
									type='reset'
									variant='secondary'
									size='sm'
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
