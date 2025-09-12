import { useGetProductSpecificationQuery } from '@/app/(features)/-hooks/use-product-specification-asm'
import { cn } from '@/common/utils/cn'
import {
	Button,
	buttonVariants,
	Div,
	Form as FormProvider,
	Icon,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { PopoverClose } from '@radix-ui/react-popover'
import { useDebounceEffect, useResetState, useSessionStorageState, useSize, useUnmount } from 'ahooks'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DefectiveGoodQueryParams } from '../../-schemas/defective-goods.schema'
import { DefectiveCategory } from '../../../-constants'
import BrandFieldControl from '../form-playground/brand-field-control'
import CategoryFieldControl from '../form-playground/category-field-control'
import ColorFieldControl from '../form-playground/color-field-control'
import CommandNumberFieldControl from '../form-playground/command-number-field-control'
import CustShoeStyleFieldControl from '../form-playground/cust-shoe-style-field-control'
import FactoryShoeStyleFieldControl from '../form-playground/factory-shoe-style-field-control'
import SizeFieldControl from '../form-playground/size-field-control'

const DEFAULT_SEARCH_TERMS: DefectiveGoodQueryParams = {
	brand_name: '',
	category: '' as DefectiveCategory,
	po: '',
	mo_no: '',
	cust_shoes_style: '',
	factory_shoes_style: '',
	color_sn: '',
	size_code: '',
	epc: '',
	page: 1
}

const SearchBox: React.FC = () => {
	const [searchTerms, setSearchTerms] = useSessionStorageState<DefectiveGoodQueryParams>('defectiveGoodsSearchTerms', {
		listenStorageChange: true,
		defaultValue: DEFAULT_SEARCH_TERMS
	})
	const [value, setValue, resetValue] = useResetState<string>(searchTerms.epc ?? '')
	const { t } = useTranslation()
	const { data: productSpecification, isLoading } = useGetProductSpecificationQuery()
	const form = useForm<DefectiveGoodQueryParams>({
		defaultValues: searchTerms
	})

	const handleEpcChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		setValue(e.currentTarget.value.toUpperCase())
	}

	useDebounceEffect(
		() => {
			setSearchTerms({ ...searchTerms, epc: value })
		},
		[value],
		{ wait: 200 }
	)

	useUnmount(() => {
		setSearchTerms(DEFAULT_SEARCH_TERMS)
	})

	const ref = useRef<HTMLDivElement>(null)
	const size = useSize(ref)

	const formFieldOrientation: 'horizontal' | 'vertical' = size?.width >= 480 ? 'horizontal' : 'vertical'

	return (
		<Div ref={ref} className='flex h-full w-full items-center space-x-2'>
			<Icon name='Search' className='basis-6' />
			<Input
				placeholder='Scan EPC to search specific item ...'
				className='border-none px-0 shadow-none'
				type='search'
				value={value}
				onChange={handleEpcChange}
				onKeyDown={(e) => {
					if (e.key === 'Backspace') resetValue()
				}}
			/>
			<FormProvider {...{ ...form, productSpecification }}>
				<Popover>
					<PopoverTrigger
						className={buttonVariants({
							variant: 'ghost',
							size: 'icon',
							className: 'aspect-square aria-expanded:text-active aria-expanded:hover:text-active'
						})}>
						<Icon name='ListFilter' />
					</PopoverTrigger>
					<PopoverContent align='end' sideOffset={6} style={{ width: size?.width }} className='relative'>
						<PopoverClose className='absolute right-4 top-4 text-muted-foreground transition-colors duration-200 hover:text-foreground'>
							<Icon name='X' />
						</PopoverClose>
						<form
							className={cn('space-y-6', isLoading && 'opacity-50')}
							onSubmit={form.handleSubmit((data) => setSearchTerms(data))}>
							<fieldset className='space-y-6'>
								<legend className='text-lg font-semibold'>Advanced Search</legend>
								<ScrollShadow
									className={cn(
										'grid max-h-96 overflow-y-auto',
										formFieldOrientation === 'horizontal' ? 'gap-y-3' : 'gap-y-6'
									)}>
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
								<Button type='reset' variant='secondary' size='sm'>
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
