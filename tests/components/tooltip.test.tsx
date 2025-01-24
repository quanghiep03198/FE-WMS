import { Tooltip } from '@/components/ui/@override/tooltip'
import { render, screen, waitFor } from '@testing-library/react'
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
		const { getByText, getByRole } = render(
			<Tooltip message={message} triggerProps={{ asChild: true }}>
				<button id='tooltip-trigger'>Hover me</button>
			</Tooltip>
		)
		const trigger = getByText('Hover me')

		await userEvent.hover(trigger)

		await waitFor(() => getByRole('tooltip'))

		expect(getByRole('tooltip')).toBeVisible()
		expect(getByRole('tooltip')).toHaveTextContent(message)
	})
})
