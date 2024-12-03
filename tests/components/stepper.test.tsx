import { Stepper, TStep, useStepContext } from '@/components/ui/@custom/stepper'
import { i18n } from '@/i18n'
import { fireEvent, render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'

const steps: TStep[] = [
	{ title: 'Step 1', description: 'Description 1', status: 'current' },
	{ title: 'Step 2', description: 'Description 2', status: 'upcoming' },
	{ title: 'Step 3', description: 'Description 3', status: 'upcoming' }
]

const StepTriggers: React.FC = () => {
	const { dispatch } = useStepContext()

	return (
		<>
			<button id='next' onClick={() => dispatch({ type: 'NEXT_STEP' })}>
				Next
			</button>
			<button id='prev' onClick={() => dispatch({ type: 'PREV_STEP' })}>
				Previous{' '}
			</button>
		</>
	)
}

describe('Stepper Component', () => {
	it('should render steps correctly', () => {
		render(
			<I18nextProvider i18n={i18n}>
				<Stepper.Provider data={steps}>
					<Stepper.Panel value={1}>Step panel 1</Stepper.Panel>
					<Stepper.Panel value={2}>Step panel 2</Stepper.Panel>
					<StepTriggers />
				</Stepper.Provider>
			</I18nextProvider>
		)

		expect(screen.getByText('Step panel 1')).toBeInTheDocument()
	})

	it('should go to the next step', async () => {
		const { getByText } = render(
			<Stepper.Provider data={steps}>
				<Stepper.Panel value={1}>Step panel 1</Stepper.Panel>
				<Stepper.Panel value={2}>Step panel 2</Stepper.Panel>
				<StepTriggers />
			</Stepper.Provider>
		)

		await fireEvent.click(getByText('Next'))
		expect(getByText('Step panel 2')).toBeInTheDocument()
	})

	it('should go to the previous step', async () => {
		const { getByText } = render(
			<Stepper.Provider data={steps}>
				<Stepper.Panel value={1}>Step panel 1</Stepper.Panel>
				<Stepper.Panel value={2}>Step panel 2</Stepper.Panel>
				<StepTriggers />
			</Stepper.Provider>
		)

		await fireEvent.click(getByText('Next'))
		await fireEvent.click(getByText('Next'))
		await fireEvent.click(getByText('Previous'))
		expect(getByText('Step panel 2')).toBeInTheDocument()
	})

	it('should go to the previous by step indicator', async () => {
		const { getByText } = render(
			<Stepper.Provider data={steps}>
				<Stepper.Panel value={1}>Step panel 1</Stepper.Panel>
				<Stepper.Panel value={2}>Step panel 2</Stepper.Panel>
				<Stepper.Panel value={3}>Step panel 3</Stepper.Panel>
				<StepTriggers />
			</Stepper.Provider>
		)

		await fireEvent.click(getByText('Step 1'))
		await fireEvent.click(getByText('Step 2'))
		await fireEvent.click(getByText('Step 1'))
		expect(getByText('Step panel 1')).toBeInTheDocument()
	})
})
