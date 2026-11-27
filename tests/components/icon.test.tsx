import { Icon } from '@components/ui/icon'
import { render } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

describe('Icon', () => {
	it.each(['SmilePlus', 'TriangleAlert', 'Trash2'] as const)(
		'renders the legacy %s name after the Lucide upgrade',
		(name) => {
			const { container } = render(React.createElement(Icon, { name, size: 18, className: 'action-icon' }))

			const svg = container.querySelector('svg')
			expect(svg).toBeInTheDocument()
			expect(svg).toHaveAttribute('width', '18')
			expect(svg).toHaveClass('action-icon')
			expect(svg?.children.length).toBeGreaterThan(0)
		}
	)

	it('continues to render canonical icon names', () => {
		const { container } = render(React.createElement(Icon, { name: 'Check' }))

		expect(container.querySelector('svg')).toBeInTheDocument()
	})
})
