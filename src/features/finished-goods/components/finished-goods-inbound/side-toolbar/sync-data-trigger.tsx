import { TRANSLATED_FACTORY } from '@common/constants/constants'
import { cn } from '@common/utils/cn'
import { Json } from '@common/utils/json'
import {
	Button,
	Div,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon,
	Typography
} from '@components/ui'
import { StatusIndicator } from '@components/ui/@custom/status-indicator'
import { Typewriter } from '@components/ui/@custom/type-writter'
import { useEffectOnce } from '@hooks/use-effect-once'
import { useSocketContext } from '@stores/socket.store'
import { hasIn } from 'lodash-es'
import type { IconNode } from 'lucide'
import { CircleCheckBig, CircleDot, CircleMinus, CircleX, LoaderCircle } from 'lucide'
import { MorphIcon } from 'morphicons/react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { v4 as uuid } from 'uuid'

type Factory = keyof typeof TRANSLATED_FACTORY

type SyncProcessState = {
	id: number
	name: string
	status: 'processing' | 'waiting' | 'completed' | 'failed' | 'cancelled'
}

type SyncMessagePayload = {
	id: string
	factory: Factory
}

const SyncDataTrigger: React.FC = () => {
	const { t } = useTranslation()
	const [data, setData] = useState<WsResponseBody<SyncProcessState[]>>(null)
	const { io, isConnected } = useSocketContext('io', 'isConnected')

	const [factory, setFactory] = useState<Factory>()

	const handleSetData = (data: string) => setData(Json.parse(data))

	useEffectOnce(() => {
		io.on('sync_decker_data', handleSetData)

		return () => {
			io.off('sync_decker_data', handleSetData)
		}
	})

	useEffect(() => {
		if (data?.error) toast.error('Synchronize failed!', { id: 'sync_decker_data_failed' })
	}, [data])

	return (
		<Div as='section' className='flex w-full grow flex-col gap-y-3'>
			<Typography className='inline-flex items-center gap-x-2 text-lg font-semibold sm:text-base md:text-base'>
				{t('ns_inoutbound:scanner_setting.synchronization')}
			</Typography>
			<Div className='flex h-full flex-1 grow flex-col items-stretch gap-6'>
				<Div className='grid grid-cols-[3fr_1fr] gap-x-6 gap-y-4'>
					<Div className='space-y-1'>
						<Typography className='inline-flex items-center gap-x-3 font-semibold' variant='small'>
							{t('ns_inoutbound:scanner_setting.decker_data_synchronization')}
						</Typography>
						<Typography className='block text-pretty' color='muted' variant='small'>
							{t('ns_inoutbound:scanner_setting.decker_data_synchronization_description')}
						</Typography>
					</Div>
					<Div className='group/trigger relative inline-flex h-8 w-full max-w-44 items-center divide-x justify-self-end rounded-md border'>
						<StatusIndicator
							aria-disabled={!factory}
							className='absolute top-0 right-0 translate-x-1/2 -translate-y-1/2'
							label={undefined}
							size='sm'
							state={isConnected ? 'active' : 'down'}
						/>
						<Button
							className='flex-1 rounded-none'
							disabled={!factory}
							size='sm'
							variant='ghost'
							onClick={() => io.emit('sync_decker_data', { id: uuid(), factory } satisfies SyncMessagePayload)}>
							{t('ns_common:actions.trigger')}
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className='size-8 rounded-none' size='icon' variant='ghost'>
									<Icon name='ChevronDown' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end' className='w-56'>
								<DropdownMenuLabel>{t('ns_common:common_fields.factory_code')}</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuRadioGroup value={factory} onValueChange={(value) => setFactory(value as Factory)}>
									{Object.entries(TRANSLATED_FACTORY).map(([value, label]) => (
										<DropdownMenuRadioItem key={value} value={value}>
											{t(`ns_common:${label}`)}
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</Div>
				</Div>
				{hasIn(data, 'metadata') && Array.isArray(data.metadata) && data.metadata.length > 0 ? (
					<StepList>
						{data.metadata.map((item, index) => {
							const icon: Record<
								SyncProcessState['status'],
								{
									icon: IconNode
									color: string
								}
							> = {
								processing: { icon: LoaderCircle, color: 'var(--foreground)' },
								completed: { icon: CircleCheckBig, color: 'var(--success)' },
								failed: { icon: CircleX, color: 'var(--destructive)' },
								cancelled: { icon: CircleMinus, color: 'var(--muted-foreground)' },
								waiting: { icon: CircleDot, color: 'var(--foreground)' }
							}
							return (
								<StepItem
									key={item.id}
									style={{
										animationFillMode: 'both',
										animationDelay: (index + 1) * 300 + 'ms'
									}}>
									<Div className='translate-y-1.5'>
										<MorphIcon
											icon={icon[item.status].icon}
											size={18}
											spring='bouncy'
											stroke={icon[item.status].color}
											className={cn({
												'animate-spin': item.status === 'processing'
											})}
										/>
									</Div>
									<Typewriter
										className='animate-typing line-clamp-1 w-full whitespace-pre-wrap'
										delay={(index + 1) * 300}
										text={t(item.name, { ns: 'ns_rfid', defaultValue: item.name })}
									/>
								</StepItem>
							)
						})}
					</StepList>
				) : (
					<Div className='bg-muted text-muted-foreground xxl:min-h-44 min-h-48 flex-1 place-content-center place-items-center rounded-md text-center text-sm'>
						{t('ns_rfid:no_sync_process')}
					</Div>
				)}
			</Div>
		</Div>
	)
}

const StepList = tw.ul`bg-secondary p-4 flex h-48 will-change-contents @7xl/page-container:p-6 @7xl/page-container:gap-3 @7xl/page-container:h-full flex-col gap-y-2 overflow-y-auto transition-height duration-300 ease-out rounded-(--radius)`
const StepItem = tw.li`flex items-start text-sm gap-2 duration-300 ease-out animate-in fade-in-0`

export default SyncDataTrigger
