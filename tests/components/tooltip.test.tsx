import { Tooltip } from '@/components/ui/@override/tooltip'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

describe('Tooltip', () => {
	const message = 'Test message'

	it('renders children correctly', async () => {
		render(
			<Tooltip message={message} providerProps={{ delayDuration: 0 }} triggerProps={{ asChild: true }}>
				<button>Hover me</button>
			</Tooltip>
		)
		expect(screen.getByText('Hover me')).toBeInTheDocument()
	})

	it('displays the message on hover', async () => {
		render(
			<Tooltip message={message} triggerProps={{ asChild: true }}>
				<button>Hover me</button>
			</Tooltip>
		)
		const trigger = screen.getByText('Hover me')
		await userEvent.hover(trigger)
		expect(trigger).toHaveAttribute('data-state', 'delayed-open')
	})
})
