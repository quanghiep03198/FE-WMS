import { StepPanel, StepsProvider, TStep } from '@/components/ui/@custom/step';
import DepartmentSelectionForm from './-department-selection-form';
import LoginForm from './-login-form';

const steps: TStep[] = [
	{
		name: 'ns_auth:step_verify_account',
		status: 'current'
	},
	{
		name: 'ns_auth:step_select_department',
		status: 'upcoming'
	}
];

const FormSection: React.FC = () => {
	return (
		<StepsProvider data={steps}>
			<StepPanel value={1}>
				<LoginForm />
			</StepPanel>
			<StepPanel value={2}>
				<DepartmentSelectionForm />
			</StepPanel>
		</StepsProvider>
	);
};

export default FormSection;
