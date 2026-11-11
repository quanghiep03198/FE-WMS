import React from 'react'
import { CommonActions } from '@common/constants/enums'
import { PageContextProvider, usePageContext } from '@features/defective-goods/contexts/page-context'
import DefectiveGoodsForm from '@features/defective-goods/components/defective-goods-combination/form-playground'
import { act, render, screen, waitFor } from '@testing-library/react'
import { useFormContext, useWatch } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
	orderDetail: undefined as { cust_shoes_style: string; factory_shoes_style: string; brand_name: string; color_sn: string } | undefined
}))

vi.mock('@tanstack/react-router', () => ({
	useLocation: () => '',
	useNavigate: () => vi.fn()
}))
vi.mock('react-i18next', async (importOriginal) => ({
	...(await importOriginal<typeof import('react-i18next')>()),
	useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } })
}))
vi.mock('@features/order/hooks/use-order-request', () => ({
	useGetManufacturingOrderQuery: () => ({ data: state.orderDetail })
}))
vi.mock('@features/product-specification/hooks/use-product-specs-request', () => ({
	useGetProductSpecsQuery: () => ({ isLoading: false })
}))
vi.mock('@features/defective-goods/hooks/use-defective-goods-request', () => ({
	useCreateDefectiveGoodsMutation: () => ({ mutateAsync: vi.fn() }),
	useUpdateDefectiveGoodsMutation: () => ({ mutateAsync: vi.fn() })
}))
vi.mock('@features/defective-goods/hooks/use-switch-combination-strategy', () => ({
	useSwitchCombinationStrategy: () => ({ currentStrategy: null, setStrategy: vi.fn() })
}))
vi.mock('@components/guards/role-base-access-control', () => ({
	default: ({ children }: React.PropsWithChildren) => children,
	ACTION_RESTRICTED_TOAST_ID: 'restricted'
}))
vi.mock('@components/forms/input', () => ({ InputFieldControl: () => null }))
vi.mock('@components/forms/select', () => ({ SelectFieldControl: () => null }))
vi.mock('@features/rfid-agent/components/playground/mobile-playground', () => ({ MobileReaderPlaygroundTrigger: () => null }))
vi.mock('@features/rfid-agent/components/playground/purchase-order-field-control', () => ({ default: () => null }))
vi.mock('@features/defective-goods/components/defective-goods-combination/data-list-panel', () => ({
	DataListPanelSheetTrigger: () => null
}))
vi.mock('@features/defective-goods/components/defective-goods-combination/form-playground/assembly-line-field-control', () => ({ default: () => null }))
vi.mock('@features/defective-goods/components/defective-goods-combination/form-playground/brand-field-control', () => ({
	default: () => {
		const { control } = useFormContext()
		return <span data-testid='brand'>{useWatch({ control, name: 'brand_name' })}</span>
	}
}))
vi.mock('@features/defective-goods/components/defective-goods-combination/form-playground/category-field-control', () => ({ default: () => null }))
vi.mock('@features/defective-goods/components/defective-goods-combination/form-playground/color-field-control', () => ({ default: () => null }))
vi.mock('@features/defective-goods/components/defective-goods-combination/form-playground/combination-strategy-select', () => ({ default: () => null }))
vi.mock('@features/defective-goods/components/defective-goods-combination/form-playground/cust-shoe-style-field-control', () => ({ default: () => null }))
vi.mock('@features/defective-goods/components/defective-goods-combination/form-playground/factory-shoe-style-field-control', () => ({ default: () => null }))
vi.mock('@features/defective-goods/components/defective-goods-combination/form-playground/list-panel-toggle', () => ({ default: () => null }))
vi.mock('@features/defective-goods/components/defective-goods-combination/form-playground/manufacturing-order-field-control', () => ({ default: () => null }))
vi.mock('@features/defective-goods/components/defective-goods-combination/form-playground/sewing-line-field-control', () => ({ default: () => null }))
vi.mock('@features/defective-goods/components/defective-goods-combination/form-playground/shoe-source-field-control', () => ({ ShoeSourceFieldControl: () => null }))
vi.mock('@features/defective-goods/components/defective-goods-combination/form-playground/size-field-control', () => ({ default: () => null }))
vi.mock('@features/defective-goods/components/defective-goods-combination/form-playground/toggle-fullscreen', () => ({ default: () => null }))
vi.mock('@features/defective-goods/components/defective-goods-combination/form-playground/user-activity-info', () => ({ default: () => null }))
vi.mock('@components/addons/tiptap/extensions', async () => {
	const { default: StarterKit } = await import('@tiptap/starter-kit')
	return { editorExtensions: [StarterKit] }
})
vi.mock('@components/addons/tiptap/components/toolbar', () => ({ default: () => null }))
vi.mock('@components/addons/tiptap/components/bubble-menu', () => ({ default: () => null }))
vi.mock('@components/addons/tiptap/components/context-menu/common-context-menu-items', () => ({ default: () => null }))
vi.mock('@components/addons/tiptap/components/context-menu/link-context-menu-items', () => ({ default: () => null }))
vi.mock('@components/addons/tiptap/components/context-menu/table-context-menu-items', () => ({ default: () => null }))

function UpdateButtons() {
	const { event$ } = usePageContext()
	return (
		<>
			<button onClick={() => event$.emit({ action: CommonActions.UPDATE, payload: { mo_no: 'MO-1', brand_name: 'Item brand', defective_description: '<p>First item</p>' } })}>First</button>
			<button onClick={() => event$.emit({ action: CommonActions.UPDATE, payload: { mo_no: 'MO-1', brand_name: 'Second brand', defective_description: '<p>Second item</p>' } })}>Second</button>
			<button onClick={() => event$.emit({ action: CommonActions.UPDATE, payload: { mo_no: 'MO-1', brand_name: 'Empty brand', defective_description: '' } })}>Empty</button>
		</>
	)
}

describe('Defective goods update', () => {
	it('shows each item description, including an empty one, without replacing form data from the order', async () => {
		state.orderDetail = {
			brand_name: 'Order brand',
			cust_shoes_style: 'Order customer style',
			factory_shoes_style: 'Order factory style',
			color_sn: 'Order color'
		}
		const { container } = render(
			<PageContextProvider>
				<UpdateButtons />
				<DefectiveGoodsForm />
			</PageContextProvider>
		)

		await act(async () => screen.getByText('First').click())
		await waitFor(() => expect(container.querySelector('.tiptap')).toHaveTextContent('First item'))
		expect(screen.getByTestId('brand')).toHaveTextContent('Item brand')

		await act(async () => screen.getByText('Second').click())
		expect(container.querySelector('.tiptap')).toHaveTextContent('Second item')
		expect(screen.getByTestId('brand')).toHaveTextContent('Second brand')

		await act(async () => screen.getByText('Empty').click())
		expect(container.querySelector('.tiptap')).toHaveTextContent('')
		expect(container.querySelector('.tiptap')).not.toHaveTextContent('Second item')
		expect(screen.getByTestId('brand')).toHaveTextContent('Empty brand')
	})
})
