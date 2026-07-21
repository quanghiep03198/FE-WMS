import { Div, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { useLocalStorageState, useUpdateEffect } from 'ahooks'
import { useTranslation } from 'react-i18next'

const fontOptions = [
	{ label: 'System', value: '*:font-sans!' },
	{ label: 'Roboto', value: '*:font-roboto!' }
]

const FontSelect = () => {
	const { t } = useTranslation()

	const [font, setFont] = useLocalStorageState<string>('font', {
		defaultValue: '*:font-sans!',
		listenStorageChange: true
	})

	useUpdateEffect(() => {
		document.body.classList.add(font)
	}, [font])

	return (
		<Div className='space-y-2'>
			<Label htmlFor='font'>{t('ns_common:settings.font')}</Label>
			<Select
				value={font ?? ''}
				onValueChange={(value) => {
					setFont((prev) => {
						document.body.classList.remove(prev)
						return value
					})
				}}>
				<SelectTrigger id='font'>
					<SelectValue placeholder='Select font' />
				</SelectTrigger>
				<SelectContent>
					{fontOptions.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</Div>
	)
}

export default FontSelect
