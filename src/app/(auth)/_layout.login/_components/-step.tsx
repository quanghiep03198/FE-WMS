import { Div, Icon, Typography } from '@/components/ui';
import { Link } from '@tanstack/react-router';
import tw from 'tailwind-styled-components';

export type StepItem = {
	index: number;
	name: string;
	href: React.ComponentProps<typeof Link>['search'];
	status: 'current' | 'upcoming' | 'completed';
};

export const Steps: React.FC<{ data: Array<StepItem> }> = ({ data }) => {
	return (
		<Div as='nav' aria-label='Progress' className='w-full'>
			<StepList role='list'>
				{data.map((step, stepIndex) => (
					<Step key={step.name} className='relative flex flex-1 cursor-default select-none'>
						{step.status === 'completed' ? (
							<Div className='group flex w-full items-center'>
								<Div className='flex items-center px-6 py-4 text-sm font-medium'>
									<Div className='flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-primary duration-200 group-hover:bg-primary/80'>
										<Icon name='Check' size={20} className='text-primary-foreground' aria-hidden='true' />
									</Div>
									<Typography color='primary' className='ml-4 text-sm font-medium'>
										{step.name}
									</Typography>
								</Div>
							</Div>
						) : step.status === 'current' ? (
							<Div className='group flex items-center px-6 py-4 text-sm font-medium' aria-current='step'>
								<Div className='flex size-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary'>
									{step.index}
								</Div>
								<Typography variant='small' color='primary' className='ml-4 text-sm font-medium'>
									{step.name}
								</Typography>
							</Div>
						) : (
							<Div className='group flex items-center'>
								<Div className='flex items-center px-6 py-4 text-sm font-medium'>
									<Div className='inline-flex size-9 flex-shrink-0 items-center justify-center rounded-full border-2 text-muted-foreground duration-200 group-hover:border-muted-foreground group-hover:text-foreground'>
										{step.index}
									</Div>
									<Typography color='muted' variant='small' className='ml-4 duration-200 group-hover:text-foreground'>
										{step.name}
									</Typography>
								</Div>
							</Div>
						)}
						{stepIndex !== data.length - 1 ? (
							<Div className='absolute right-0 top-0  h-full w-5 sm:hidden' aria-hidden='true'>
								<Div as='svg' className='h-full w-full text-border' viewBox='0 0 22 80' fill='none' preserveAspectRatio='none'>
									<Div as='path' d='M0 -2L20 40L0 82' vectorEffect='non-scaling-stroke' stroke='currentcolor' strokeLinejoin='round' />
								</Div>
							</Div>
						) : null}
					</Step>
				))}
			</StepList>
		</Div>
	);
};

const StepList = tw.ol`flex divide-y-0 divide-border rounded-md border sm:flex-col sm:divide-y`;
const Step = tw.li`relative flex flex-1`;
