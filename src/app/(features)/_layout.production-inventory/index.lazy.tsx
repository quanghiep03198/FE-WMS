import { Div, Icon, Typography } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreadcrumbContext } from '../_contexts/-breadcrumb-context'
import DataSection from './_components/-data-section'
import EmptyState from './_components/-empty-state'
import SearchBox from './_components/-search-box'

export const Route = createLazyFileRoute('/(features)/_layout/production-inventory/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/production-inventory', text: t('ns_common:navigation.inventory_estimation') }])
	}, [i18n.language])

	return (
		<Div className='mt-6'>
			<Div className='flex flex-col items-center gap-y-2'>
				<Div className='mb-2'>
					<Icon name='PackageSearch' size={48} strokeWidth={1} />
				</Div>
				<Typography variant='h5' className='text-center capitalize'>
					{t('ns_inoutbound:titles.production_inventory_estimation')}
				</Typography>
				<Typography variant='small' color='muted'>
					{t('ns_inoutbound:description.inventory_estimation')}
				</Typography>
			</Div>
			<Div className='mx-auto flex h-full w-full max-w-3xl flex-col items-stretch gap-y-6 py-8'>
				<SearchBox />
				<EmptyState />
			</Div>
			<DataSection />
		</Div>
	)
}
