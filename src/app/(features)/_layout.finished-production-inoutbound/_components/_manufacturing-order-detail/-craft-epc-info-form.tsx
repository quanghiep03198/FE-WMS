import {
	ComboboxFieldControl,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Form as FormProvider,
	SelectFieldControl
} from '@/components/ui'
import { InputFieldControl } from '@/components/ui/@hook-form/input-field-control'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useGetCommandNumberDetailQuery, useSearchCommandNumberQuery } from '../../_apis/rfid.api'

const CraftEpcInfoForm: React.FC<any> = () => {
	const form = useForm({})
	const selectedCommandNumber = form.watch('mo_no')
	const [searchTerm, setSearchTerm] = useState<string>('')
	const { t } = useTranslation()
	const { data: commandNumbers } = useSearchCommandNumberQuery(searchTerm)
	const { data: commandNumberDetail } = useGetCommandNumberDetailQuery(selectedCommandNumber)
	const [availableSizes, setAvailableSizes] = useState([])
	const [availableCmdSequence, setAvailableCmdSequence] = useState([])

	useEffect(() => {
		if (commandNumberDetail) {
			form.setValue('mat_code', commandNumberDetail.mat_code)
			form.setValue('shoes_style_code_factory', commandNumberDetail.shoes_style_code_factory)
			setAvailableSizes(commandNumberDetail.sizes)
			setAvailableCmdSequence(commandNumberDetail.mo_noseq)
		}
	}, [commandNumberDetail])

	return (
		<Dialog>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('ns_erp:rfid_match_craft_form.title')}</DialogTitle>
					<DialogDescription>{t('ns_erp:rfid_match_craft_form.description')}</DialogDescription>
				</DialogHeader>
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit((data) => console.log(data))}>
						<ComboboxFieldControl
							name='mo_no'
							label={t('ns_erp:fields.mo_no_actual')}
							datalist={commandNumbers}
							labelField='label'
							valueField='value'
							onInput={setSearchTerm}
						/>
						<InputFieldControl label={t('ns_erp:fields.mat_code')} name='mat_code' readonly />
						<InputFieldControl
							label={t('ns_erp:fields.shoestyle_codefactory')}
							name='shoes_style_code_factory'
							readonly
						/>
						<SelectFieldControl
							label={t('ns_erp:fields.mo_noseq')}
							name='mo_noseq'
							datalist={availableCmdSequence}
							labelField='label'
							valueField='value'
						/>
						<InputFieldControl name='size_code' hidden />
						<ComboboxFieldControl
							name='size_numcode'
							datalist={availableSizes}
							labelField='size_numcode'
							valueField='size_numcode'
						/>
						<InputFieldControl
							name='quantity'
							type='number'
							labels={t('ns_common:common_fields.quantity')}
							placeholder='0'
						/>
					</Form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}

const Form = tw.form`grid gap-y-6`

export default CraftEpcInfoForm
