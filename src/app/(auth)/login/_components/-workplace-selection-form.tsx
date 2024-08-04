import { useAuth } from '@/common/hooks/use-auth'
import { Button, Form as FormProvider, Icon, SelectFieldControl } from '@/components/ui'
import { useStepContext } from '@/components/ui/@custom/step'
import { CompanyService } from '@/services/company.service'
import { useQuery } from '@tanstack/react-query'
import { pick } from 'lodash'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

type FormValues = { company_code: string }

const COMPANY_PROVIDE_TAG = 'COMPANIES' as const

const WorkplaceSelectionForm: React.FC = () => {
	const { accessToken, setUserCompany } = useAuth()
	const { dispatch } = useStepContext()
	const { t } = useTranslation(['ns_auth', 'ns_company'])
	const form = useForm<FormValues>()
	const companyCode = form.watch('company_code')

	const { data, isFetching } = useQuery({
		queryKey: [COMPANY_PROVIDE_TAG],
		queryFn: () => CompanyService.getCompanies(),
		enabled: !!accessToken,
		select: (data) => {
			return Array.isArray(data.metadata) ? data.metadata : []
		}
	})

	const selectedCompany = useMemo(() => {
		if (!Array.isArray(data)) return null
		return data.find((item) => item.company_code === companyCode)
	}, [data, companyCode])

	return (
		<FormProvider {...form}>
			<Form
				onSubmit={form.handleSubmit(() => setUserCompany(pick(selectedCompany, ['company_name', 'company_code'])))}>
				<SelectFieldControl
					label={t('ns_company:company')}
					name='company_code'
					placeholder={isFetching ? 'Loading ...' : '-- Select --'}
					datalist={data}
					labelField='company_name'
					valueField='company_code'
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
