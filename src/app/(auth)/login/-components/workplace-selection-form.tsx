import type { FactoryCode } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
import { Button, Form as FormProvider, Icon, SelectFieldControl } from '@/components/ui'
import { useStepContext } from '@/components/ui/@custom/stepper'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

type FormValues = { factory_code: FactoryCode }

const WorkplaceSelectionForm: React.FC = () => {
	const { user, setCurrentFactory } = useAuth()
	const { dispatch } = useStepContext()
	const { t, i18n } = useTranslation(['ns_auth', 'ns_company'])
	const form = useForm<FormValues>()
	const currentFactoryCode = form.watch('factory_code')

	const authorizedFactories = useMemo(() => {
		if (!user || !Array.isArray(user.authorized_factory_codes)) return []
		return user.authorized_factory_codes.map((item) => ({
			factory_code: item,
			factory_name: t(`ns_common:factory.${item}`, { defaultValue: item })
		}))
	}, [user, i18n.language])

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit((data) => setCurrentFactory(data.factory_code))}>
				<SelectFieldControl
					label={t('ns_company:factory')}
					name='factory_code'
					datalist={authorizedFactories}
					labelField='factory_name'
					valueField='factory_code'
					onValueChange={() => dispatch({ type: 'COMPLETE' })}
				/>
				<Button type='submit' className='gap-x-2' disabled={!currentFactoryCode}>
					{t('ns_auth:actions.go_to_dashboard')} <Icon name='ArrowRight' />
				</Button>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`w-full flex flex-col items-stretch rounded-md gap-y-6`

export default WorkplaceSelectionForm
