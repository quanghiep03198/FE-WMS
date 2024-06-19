import useAuth from '@/common/hooks/use-auth'
import { Button, Form as FormProvider, Icon, SelectFieldControl } from '@/components/ui'
import { StepContext } from '@/components/ui/@custom/step'
import { CompanyService } from '@/services/company.service'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

type FormValues = { company_code: string }

const WorkplaceSelectionForm: React.FC = () => {
	const { isAuthenticated, setUserCompany } = useAuth()
	const { dispatch } = useContext(StepContext)
	const { t } = useTranslation(['ns_auth', 'ns_company'])
	const form = useForm<FormValues>()
	const companyCode = form.watch('company_code')
	const router = useRouter()

	const { data, isFetching } = useQuery({
		queryKey: ['companies'],
		queryFn: () => CompanyService.getCompanies(),
		enabled: isAuthenticated,
		select: (data) => {
			return Array.isArray(data.metadata)
				? data.metadata.map((company) => ({ value: company.company_code, label: company.display_name }))
				: []
		}
	})

	return (
		<FormProvider {...form}>
			<Form
				onSubmit={form.handleSubmit(({ company_code }) => {
					console.log(company_code)
					router.invalidate().finally(() => setUserCompany(company_code))
				})}>
				<SelectFieldControl
					label={t('ns_company:company')}
					name='company_code'
					placeholder={isFetching ? 'Loading ...' : '-- Select --'}
					options={data}
					onValueChange={() => dispatch({ type: 'COMPLETE' })}
					disabled={isFetching}
					control={form.control}
				/>
				<Button type='submit' className='gap-x-2' disabled={!companyCode}>
					{t('ns_auth:actions.go_to_dashboard')} <Icon name='ArrowRight' />
				</Button>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`w-full flex flex-col items-stretch rounded-md gap-y-6`

export default WorkplaceSelectionForm
