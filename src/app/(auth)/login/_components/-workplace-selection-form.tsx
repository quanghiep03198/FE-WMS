import useAuth from '@/common/hooks/use-auth'
import { Button, Form as FormProvider, Icon, SelectFieldControl } from '@/components/ui'
import { StepContext } from '@/components/ui/@custom/step'
import { CompanyService } from '@/services/company.service'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'
import React, { useContext, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'

type FormValue = { company_code: string }

const WorkplaceSelectionForm: React.FC = () => {
	const { isAuthenticated: authenticated, setUserCompany } = useAuth()
	const navigate = useNavigate()
	const { dispatch } = useContext(StepContext)
	const { t } = useTranslation(['ns_auth', 'ns_company'])
	const form = useForm<FormValue>()
	const companyCode = form.watch('company_code')
	const router = useRouter()

	const { data, isFetching } = useQuery({
		queryKey: ['companies', authenticated],
		queryFn: CompanyService.getCompanies,
		enabled: Boolean(authenticated),
		select(data) {
			return data.metadata
		}
	})

	const companyOptions = useMemo(() => {
		return Array.isArray(data)
			? data.map((company) => ({ value: company.company_code, label: company.display_name }))
			: []
	}, [data])

	useEffect(() => {
		if (companyCode) dispatch({ type: 'COMPLETE' })
	}, [companyCode])

	const handleCompleteLogin = ({ company_code }: FormValue) => {
		router.invalidate().finally(() => setUserCompany(company_code))
	}

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit(handleCompleteLogin)}>
				<SelectFieldControl
					label={t('ns_company:company')}
					name='company_code'
					options={companyOptions}
					disabled={isFetching}
					control={form.control}
				/>
				<Button className='gap-x-2' disabled={!companyCode}>
					{t('ns_auth:actions.go_to_dashboard')} <Icon name='ArrowRight' />
				</Button>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`w-full flex flex-col items-stretch rounded-md gap-y-6`

export default WorkplaceSelectionForm
