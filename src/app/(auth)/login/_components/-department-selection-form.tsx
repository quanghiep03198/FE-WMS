import { AuthContext, TAuthState } from '@/components/providers/auth-provider';
import { Button, Form as FormProvider, Icon, SelectFieldControl } from '@/components/ui';
import { StepContext } from '@/components/ui/@custom/step';
import { CompanyService } from '@/services/company.service';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import React, { useContext, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import tw from 'tailwind-styled-components';

type FormValue = { company_code: string; department_code: string };

const DepartmentSelectionForm: React.FC = () => {
	const { authenticated, setAuthState } = useContext(AuthContext);
	const { dispatch } = useContext(StepContext);
	const { t } = useTranslation();
	const form = useForm<FormValue>();
	const watchFields = form.watch(['company_code', 'department_code']);
	const navigate = useNavigate();

	const { data, isFetching } = useQuery({
		enabled: authenticated,
		refetchOnMount: false,
		queryKey: ['departments', 'companies'],
		queryFn: CompanyService.getCompanies
	});

	const companyOptions = useMemo(
		() => (Array.isArray(data) ? data.map((company) => ({ value: company.company_code, label: company.company_name })) : []),
		[data]
	);

	const departmentOptions = useMemo(() => {
		const departments = Array.isArray(data) ? data.find((company) => company.company_code === watchFields[0])?.departments ?? [] : [];
		return departments.map((dept) => ({ label: dept.department_name, value: dept.department_code }));
	}, [watchFields[0]]);

	useEffect(() => {
		if (Array.isArray(departmentOptions) && departmentOptions.length > 0) form.setValue('department_code', departmentOptions[0].value);
		if (watchFields.every((field) => !!field)) dispatch({ type: 'COMPLETE' });
	}, [...watchFields, departmentOptions]);

	const handleCompleteLogin = (data: FormValue) => {
		setAuthState((prev) => {
			return { ...(prev as TAuthState), ...data };
		});
		navigate({ to: '/dashboard' });
	};

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit(handleCompleteLogin)}>
				<SelectFieldControl label={t('ns_company:company')} name='company_code' options={companyOptions} disabled={isFetching} control={form.control} />
				<SelectFieldControl
					label={t('ns_company:department')}
					name='department_code'
					options={departmentOptions}
					disabled={isFetching || !watchFields[0]}
					control={form.control}
				/>
				<Button className='gap-x-2' disabled={!watchFields.every((field) => !!field)}>
					{t('ns_auth:action_go_to_dashboard')} <Icon name='ArrowRight' />
				</Button>
			</Form>
		</FormProvider>
	);
};

const Form = tw.form`w-full flex flex-col items-stretch rounded-md gap-y-6`;

export default DepartmentSelectionForm;
