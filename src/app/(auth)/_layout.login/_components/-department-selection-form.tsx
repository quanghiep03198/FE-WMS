import { AuthContext } from '@/components/providers/auth-provider';
import { Button, Form as FormProvider, Icon, SelectFieldControl } from '@/components/ui';
import { CompanyService } from '@/services/company.service';
import { useQuery } from '@tanstack/react-query';
import React, { useContext, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import tw from 'tailwind-styled-components';
import { LoginContext } from '../_context/-login-context';

const DepartmentSelectionForm: React.FC = () => {
	const { authenticated } = useContext(AuthContext);
	const { t } = useTranslation('company.ns');
	const form = useForm({});
	const watchFields = form.watch(['company_code', 'department_code']);
	const { setSteps } = useContext(LoginContext);

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
		if (watchFields.every((field) => !!field)) setSteps((prev) => prev.map((step) => ({ ...step, status: 'completed' })));
	}, [...watchFields, departmentOptions]);

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit((data) => console.log(data))}>
				<SelectFieldControl label={t('company')} name='company_code' options={companyOptions} disabled={isFetching} control={form.control} />
				<SelectFieldControl
					label={t('department')}
					name='department_code'
					options={departmentOptions}
					disabled={isFetching || !watchFields[0]}
					control={form.control}
				/>
				<Button className='gap-x-2' disabled={!watchFields.every((field) => !!field)}>
					Go to dashboard <Icon name='ArrowRight' />
				</Button>
			</Form>
		</FormProvider>
	);
};

const Form = tw.form`w-full flex flex-col items-stretch rounded-md gap-y-6`;

export default DepartmentSelectionForm;
