import { Div, Icon, Typography } from '@/components/ui'
import { TFunction } from 'i18next'
import React, { createContext, use, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

// #region Step types
export type TStep = {
	index?: number
	title: FirstParameter<TFunction<undefined, undefined>> & string
	description?: FirstParameter<TFunction<undefined, undefined>> & string
	status: 'current' | 'upcoming' | 'completed'
}

type TStepState = {
	data: TStep[]
	finishedSteps: number[]
	currentStep: number
	canNextStep: boolean
	canPrevStep: boolean
}

type TStepAction =
	| { type: 'PREV_STEP' }
	| { type: 'NEXT_STEP' }
	| { type: 'GO_TO_STEP'; payload: number }
	| { type: 'COMPLETE' }

type TStepContext = {
	steps: TStepState
	dispatch: React.Dispatch<TStepAction>
}

type TStepsProps = { enableChangeStep?: boolean }

type TStepProviderProps = Pick<TStepState, 'data'> & TStepsProps & React.PropsWithChildren

type TStepPanelProps = { value: TStep['index'] } & React.PropsWithChildren
// #endregion

//	#region Step context
const reducer: React.Reducer<TStepState, TStepAction> = (state, action) => {
	switch (action.type) {
		case 'PREV_STEP': {
			if (!state.canPrevStep) return state
			return {
				...state,
				currentStep: state.currentStep - 1,
				data: state.data.map((step) => {
					const status =
						step.index! < state.currentStep - 1
							? 'completed'
							: step.index === state.currentStep - 1
								? 'current'
								: 'upcoming'
					return { ...step, status }
				})
			}
		}

		case 'NEXT_STEP': {
			const currentStep = state.currentStep + 1
			if (state.currentStep == state.data.length) return state

			return {
				...state,
				currentStep: currentStep,
				canNextStep: currentStep < state.data.length && state.finishedSteps.includes(state.currentStep),
				canPrevStep: true,
				finishedSteps: [...new Set([state.currentStep, ...state.finishedSteps])].sort((a, b) => a - b),
				data: state.data.map((step) => {
					const status =
						step.index! < currentStep ? 'completed' : step.index === currentStep ? 'current' : 'upcoming'
					return { ...step, status }
				})
			}
		}

		case 'GO_TO_STEP': {
			const currentStep = action.payload

			return {
				...state,
				currentStep: currentStep,
				canNextStep: currentStep < state.data.length && state.finishedSteps.includes(state.currentStep),
				// canPrevStep: state.finishedSteps.some((step) => currentStep >= step),
				data: state.data.map((step) => {
					const status =
						step.index < currentStep ? 'completed' : step.index === currentStep ? 'current' : 'upcoming'
					return { ...step, status }
				})
			}
		}

		case 'COMPLETE': {
			return {
				...state,
				currentStep: state.data.length,
				canNextStep: false,
				canPrevStep: true,
				data: state.data.map((step) => ({ ...step, status: 'completed' })),
				finishedSteps: [...new Set([...state.finishedSteps, state.data.length])].sort((a, b) => a - b)
			}
		}

		default: {
			throw new Error('Invalid step action')
		}
	}
}

const initialState: TStepState = { data: [], finishedSteps: [], currentStep: 1, canNextStep: false, canPrevStep: false }

const StepContext = createContext<TStepContext>(null)

const StepProvider: React.FC<TStepProviderProps> = ({ data, enableChangeStep = true, children }) => {
	const [steps, dispatch] = useReducer(reducer, {
		...initialState,
		data: data.map((step: TStep, index: number) => ({ ...step, index: index + 1 }))
	})

	return (
		<StepContext.Provider value={{ steps, dispatch }}>
			<Div className='space-y-6'>
				<Steps enableChangeStep={enableChangeStep} />
				{children}
			</Div>
		</StepContext.Provider>
	)
}
// #endregion

// #region Step components
const StepList = tw.ol`grid grid-flow-col sm:grid-flow-row md:grid-flow-row auto-cols-fr isolate divide-y-0 divide-border rounded-md border sm:grid-cols-1 sm:divide-y md:divide-y md:grid-cols-1 transition-all`
const StepItem = tw.li`flex items-center py-6 text-sm relative hover:opacity-80 px-4 whitespace-nowrap font-medium`
const StepTrigger = tw.div`inline-flex items-center justify-center gap-x-4 px-4 text-pretty`
const StepIndicator = tw.div`grid aspect-square size-10 place-content-center rounded-full border-2 font-semibold`

const Steps: React.FC<TStepsProps> = ({ enableChangeStep }) => {
	const { t } = useTranslation()

	const {
		steps: { data, finishedSteps },
		dispatch
	} = use(StepContext)

	const handleChangeStep = (step: TStep) => {
		if (!enableChangeStep) return
		if (finishedSteps.includes(step.index) || step.index === finishedSteps.at(-1) + 1) {
			dispatch({ type: 'GO_TO_STEP', payload: step.index })
		}
	}

	return (
		<Div as='nav' aria-label='Progress' className='sticky top-0 z-20 w-full bg-background'>
			<StepList role='list'>
				{data.map((step: TStep) => {
					const stepTitle = t(step.title, { defaultValue: step.title, ns: undefined })

					return (
						<StepItem key={step.index} onClick={() => handleChangeStep(step)}>
							{step.status === 'completed' ? (
								<StepTrigger>
									<StepIndicator className='border-success bg-success duration-200 group-hover:bg-success/80'>
										<Icon name='Check' size={20} className='text-success-foreground' aria-hidden='true' />
									</StepIndicator>
									<Div>
										<Typography color='success' className='font-medium'>
											{stepTitle}
										</Typography>
										{step.description && (
											<Typography variant='small' color='muted' className='font-normal'>
												{t(step.description, { defaultValue: step.description, ns: undefined })}
											</Typography>
										)}
									</Div>
								</StepTrigger>
							) : step.status === 'current' ? (
								<StepTrigger>
									<StepIndicator className='border-success text-success'>{step.index}</StepIndicator>
									<Div>
										<Typography color='success'>{stepTitle}</Typography>
										{step.description && (
											<Typography variant='small' color='muted' className='font-normal'>
												{t(step.description, { defaultValue: step.description, ns: undefined })}
											</Typography>
										)}
									</Div>
								</StepTrigger>
							) : (
								<StepTrigger>
									<StepIndicator className='text-muted-foreground'>{step.index}</StepIndicator>
									<Div>
										<Typography color='muted'>{stepTitle}</Typography>
										{step.description && (
											<Typography variant='small' color='muted' className='basis-1/4 font-normal'>
												{t(step.description, { defaultValue: step.description, ns: undefined })}
											</Typography>
										)}
									</Div>
								</StepTrigger>
							)}
							{step.index !== data.length && <StepSeparator />}
						</StepItem>
					)
				})}
			</StepList>
		</Div>
	)
}

const StepSeparator: React.FC = () => (
	<div className='absolute right-0 top-0 h-full w-5 translate-x-1/2 sm:hidden' aria-hidden='true'>
		<svg className='h-full w-full text-border' viewBox='0 0 22 80' fill='none' preserveAspectRatio='none'>
			<path d='M0 -2L20 40L0 82' vectorEffect='non-scaling-stroke' stroke='currentcolor' strokeLinejoin='round' />
		</svg>
	</div>
)

const StepPanel: React.FC<TStepPanelProps> = ({ value, children }) => {
	const {
		steps: { currentStep }
	} = useStepContext()

	return currentStep === value && children
}

// #endregion

export const useStepContext = () => use(StepContext)

export const Stepper = {
	Provider: StepProvider,
	Panel: StepPanel
}
