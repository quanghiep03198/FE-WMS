import { useGetTenantByFactory } from '@/app/(features)/_apis/use-tenacy.api'
import { PresetBreakPoints } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import {
	Div,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Typography
} from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../_contexts/-page-context'

const TenancySelect: React.FC = () => {
	const isSmallScreen = useMediaQuery(PresetBreakPoints.SMALL)
	const { t } = useTranslation()
	const { scanningStatus, connection, setConnection } = usePageContext(
		'scanningStatus',
		'connection',
		'reset',
		'setScanningStatus',
		'setConnection',
		'handleToggleScanning',
		'reset'
	)

	const { data: tenants } = useGetTenantByFactory()

	return (
		<Select
			value={connection}
			disabled={typeof scanningStatus !== 'undefined'}
			onValueChange={(value) => setConnection(value)}>
			<HoverCard openDelay={50} closeDelay={50}>
				<HoverCardTrigger asChild className='w-full basis-1/5 sm:basis-full md:basis-1/3 lg:basis-1/3'>
					<SelectTrigger>
						<Div className='flex flex-1 items-center gap-x-3'>
							<Icon name='Server' size={18} stroke='hsl(var(--active))' />
							<SelectValue placeholder={t('ns_common:actions.select_server')} />
						</Div>
					</SelectTrigger>
				</HoverCardTrigger>
				<HoverCardContent side={isSmallScreen ? 'top' : 'right'} align='start' sideOffset={8}>
					<Typography variant='small'>{t('ns_inoutbound:description.select_readable_database')}</Typography>
				</HoverCardContent>
			</HoverCard>
			<SelectContent>
				<SelectGroup>
					{Array.isArray(tenants) &&
						tenants.map((item) => (
							<SelectItem key={item.id} value={item.id}>
								{t('ns_common:others.server', { alias: item.alias, defaultValue: item.alias })}
							</SelectItem>
						))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}

export default TenancySelect
