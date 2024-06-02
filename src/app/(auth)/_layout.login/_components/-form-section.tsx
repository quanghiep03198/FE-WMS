import useQueryParams from '@/common/hooks/use-query-params';
import { useContext } from 'react';
import { LoginContext } from '../_context/-login-context';
import DepartmentSelectionForm from './-department-selection-form';
import LoginForm from './-login-form';
import { Steps } from './-step';

const FormSection: React.FC = () => {
	const { searchParams } = useQueryParams();
	const { steps } = useContext(LoginContext);

	return (
		<>
			<Steps data={steps} />
			{/* Login form */}
			{searchParams.step == '1' ? <LoginForm /> : <DepartmentSelectionForm />}
		</>
	);
};

export default FormSection;
