import { Icon, Separator, Typography } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import ConnectionInsight from './-connection-insight'
import SettingPanel from './-setting-panel'
// import useQuerySelector from '@/common/hooks/use-query-selector'
// import { useEffect } from 'react'

const ScanningToolbox: React.FC = () => {
	const { t } = useTranslation()

	return (
		<ToolbarWrapper>
			<ToolbarHeader>
				<Typography
					variant='h6'
					className='inline-flex items-center gap-x-2 text-lg font-semibold sm:text-base md:text-base'>
					<Icon name='Settings2' size={18} />
					{t('ns_common:navigation.settings')}
				</Typography>
			</ToolbarHeader>
			<ToolbarBody>
				<SettingPanel />
				<Separator className='block @3xl:hidden' />
				<Separator orientation='vertical' className='hidden @3xl:block lg:block' />
				<ConnectionInsight />
			</ToolbarBody>
		</ToolbarWrapper>
	)
}

const ToolbarWrapper = tw.div`@container group flex flex-col rounded-lg border bg-background`
const ToolbarHeader = tw.div`flex items-center justify-between gap-x-2 border-b px-4 py-2 bg-table-head rounded-t-[inherit]`
const ToolbarBody = tw.div`flex items-stretch flex-grow gap-6 py-4 @3xl:flex-row @3xl:justify-start basis-full flex-col-reverse justify-end`

export default ScanningToolbox
