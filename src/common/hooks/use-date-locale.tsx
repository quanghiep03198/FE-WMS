import { enUS, vi, zhCN } from 'date-fns/locale'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export const useDateLocale = () => {
	const { i18n } = useTranslation()
	return useMemo(() => {
		switch (i18n.language) {
			case 'vi':
				return vi
			case 'cn':
				return zhCN
			case 'en':
				return enUS
			default:
				return enUS // Fallback to Vietnamese if no match
		}
	}, [i18n.language])
}
