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
import { ProducingProcessSuffix } from '../../_constants/index.const'

import useQueryParams from '@/common/hooks/use-query-params'
import { usePageContext } from '../../_contexts/-page-context'
import { PMInboundURLSearch } from '../../_schemas/pm-inbound.schema'

const ProcessSelect = () => {
	const { t } = useTranslation()
	const { scanningStatus } = usePageContext('scanningStatus')
	const { searchParams, setParams } = useQueryParams<PMInboundURLSearch>({
		process: ProducingProcessSuffix.HALF_FINISHED
	})

	return (
		<Select
			value={searchParams.process}
			disabled={typeof scanningStatus !== 'undefined'}
			onValueChange={(value) => setParams({ process: value })}>
			<HoverCard openDelay={50} closeDelay={50}>
				<HoverCardTrigger asChild>
					<SelectTrigger className='w-full'>
						<Div className='flex flex-1 items-center gap-x-3'>
							<Icon name='Workflow' size={18} stroke='hsl(var(--primary))' />
							<SelectValue placeholder='Select process' className='line-clamp-1' />
						</Div>
					</SelectTrigger>
				</HoverCardTrigger>
				<HoverCardContent side='bottom' align='start'>
					<Typography variant='small'>
						Lựa chọn công đoạn quét tem tương ứng với các bộ phận đương nhiệm
					</Typography>
				</HoverCardContent>
			</HoverCard>
			<SelectContent>
				<SelectGroup>
					<SelectItem key={ProducingProcessSuffix.HALF_FINISHED} value={ProducingProcessSuffix.HALF_FINISHED}>
						{t('ns_inoutbound:rfid_process.production_management_inbound')}
					</SelectItem>
					<SelectItem key={ProducingProcessSuffix.CUTTING} value={ProducingProcessSuffix.CUTTING}>
						{t('ns_inoutbound:rfid_process.cutting_inbound')}
					</SelectItem>
					<SelectItem key={ProducingProcessSuffix.SHAPING} value={ProducingProcessSuffix.SHAPING}>
						{t('ns_inoutbound:rfid_process.shaping_inbound')}
					</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}

export default ProcessSelect
