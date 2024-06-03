import { Div, Icon, Typography } from '@/components/ui';
import React, { createContext, useContext, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import tw from 'tailwind-styled-components';

export type TStep = {
	index?: number;
	name: string;
	status: 'current' | 'upcoming' | 'completed';
};
type TStepState = { data: TStep[]; currentStep: number; canNextStep: boolean; canPrevStep: boolean };
type TStepAction =
	| { type: 'PREV_STEP'; payload?: number }
	| { type: 'NEXT_STEP'; payload?: number }
	| { type: 'GO_TO_STEP'; payload: number }
	| { type: 'COMPLETE'; payload?: number };
type TStepContext = {
	steps: TStepState;
	dispatch: React.Dispatch<TStepAction>;
};

const reducer: React.Reducer<TStepState, TStepAction> = (state, action) => {
	switch (action.type) {
		case 'PREV_STEP':
			if (!state.canPrevStep) return state;
			return { ...state, currentStep: state.currentStep - 1 };

		case 'NEXT_STEP':
			const currentStep = state.currentStep + 1;
			if (state.currentStep == state.data.length) return state;

			return {
				...state,
				currentStep: currentStep,
				canNextStep: currentStep < state.data.length,
				canPrevStep: true,
				data: state.data.map((step) => {
					if (step.index! < currentStep) return { ...step, status: 'completed' };
					else if (step.index === currentStep) return { ...step, status: 'current' };
					else return step;
				})
			};

		case 'COMPLETE':
			return {
				...state,
				currentStep: state.data.length,
				canNextStep: false,
				canPrevStep: true,
				data: state.data.map((step) => ({ ...step, status: 'completed' }))
			};

		default:
			throw new Error('Invalid step action');
	}
};

const initialState: TStepState = { data: [], currentStep: 1, canNextStep: false, canPrevStep: false };

export const StepContext = createContext<TStepContext>({ steps: initialState, dispatch: () => {} });

export const StepProvider: React.FC<{ data: TStep[] } & React.PropsWithChildren> = ({ data, children }) => {
	const [steps, dispatch] = useReducer(reducer, {
		...initialState,
		data: data.map((step: TStep, index: number) => ({ ...step, index: index + 1 }))
	});

	return (
		<StepContext.Provider value={{ steps, dispatch }}>
			<Steps />
			{children}
		</StepContext.Provider>
	);
};

const Steps: React.FC = () => {
	const {
		steps: { data }
	} = useContext(StepContext);

	const { t } = useTranslation();

	return (
		<Div as='nav' aria-label='Progress' className='w-full'>
			<StepList role='list'>
				{data.map((step: TStep) => {
					return (
						<Step key={step.index}>
							{step.status === 'completed' ? (
								<Div className='inline-flex items-center justify-center gap-x-4 px-4'>
									<Div className='flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-primary duration-200 group-hover:bg-primary/80'>
										<Icon name='Check' size={20} className='text-primary-foreground' aria-hidden='true' />
									</Div>
									<Typography color='primary' className='ml-4 text-sm font-medium'>
										{t(step.name)}
									</Typography>
								</Div>
							) : step.status === 'current' ? (
								<Div className='inline-flex items-center justify-center gap-x-4 px-4'>
									<Div className='flex size-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary'>
										{step.index}
									</Div>
									<Typography variant='small' color='primary'>
										{t(step.name)}
									</Typography>
								</Div>
							) : (
								<Div className='inline-flex items-center justify-center gap-x-4 px-4'>
									<Div className='inline-flex size-9 flex-shrink-0 items-center justify-center rounded-full border-2 text-muted-foreground'>
										{step.index}
									</Div>
									<Typography color='muted' variant='small'>
										{t(step.name)}
									</Typography>
								</Div>
							)}
							{step.index !== data.length ? (
								<Div className='absolute right-0 top-0 h-full w-5 translate-x-1/2 sm:hidden' aria-hidden='true'>
									<Div
										as='svg'
										className='h-full w-full text-border'
										viewBox='0 0 22 80'
										fill='none'
										preserveAspectRatio='none'>
										<Div
											as='path'
											d='M0 -2L20 40L0 82'
											vectorEffect='non-scaling-stroke'
											stroke='currentcolor'
											strokeLinejoin='round'
										/>
									</Div>
								</Div>
							) : null}
						</Step>
					);
				})}
			</StepList>
		</Div>
	);
};

const StepPanel: React.FC<{ value: TStep['index'] } & React.PropsWithChildren> = ({ value, children }) => {
	const {
		steps: { currentStep }
	} = useContext(StepContext);

	return currentStep === value ? children : null;
};

export const Stepper = {
	Panel: StepPanel,
	Provider: StepProvider
};

const StepList = tw.ol`grid grid-flow-col sm:grid-flow-row auto-cols-fr isolate divide-y-0 divide-border rounded-md border sm:grid-cols-1 sm:divide-y`;
const Step = tw.li`flex items-center py-4 text-sm relative hover:opacity-80 px-4 whitespace-nowrap font-medium`;
