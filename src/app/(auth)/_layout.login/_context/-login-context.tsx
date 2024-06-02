import useQueryParams from '@/common/hooks/use-query-params';
import { AuthContext } from '@/components/providers/auth-provider';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { StepItem } from '../_components/-step';

export const LoginContext = createContext<{ steps: Array<StepItem>; setSteps: React.Dispatch<React.SetStateAction<StepItem[]>> }>({
	steps: [],
	setSteps: () => {}
});

export const LoginProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [steps, setSteps] = useState<Array<StepItem>>([
		{
			index: 1,
			name: 'Verify your account',
			href: { step: 1 },
			status: 'current'
		},
		{
			index: 2,
			name: 'Select department',
			href: { step: 2 },
			status: 'upcoming'
		}
	]);

	const { searchParams, setParams } = useQueryParams();

	const { authenticated } = useContext(AuthContext);

	useEffect(() => {
		setParams({ step: authenticated ? 2 : 1 });

		if (steps.map((item) => String(item.index)).includes(String(searchParams.step))) {
			setSteps((prev) =>
				prev.map((item) => {
					switch (true) {
						case item.index < +searchParams.step:
							return { ...item, status: 'completed' };
						case item.index === +searchParams.step && !prev.every((step) => step.status === 'completed'):
							return { ...item, status: 'current' };
						case item.index === +searchParams.step && prev.every((step) => step.status === 'completed'):
							return { ...item, status: 'completed' };
						default:
							return item;
					}
				})
			);
		}
	}, [searchParams, authenticated]);

	return <LoginContext.Provider value={{ steps, setSteps }}>{children}</LoginContext.Provider>;
};
