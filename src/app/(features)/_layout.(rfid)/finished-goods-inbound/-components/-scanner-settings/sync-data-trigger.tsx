import { useSocketIo } from '@/common/hooks/use-socket-io'
import { cn } from '@/common/utils/cn'
import { Button, Div, Icon, Typography } from '@/components/ui'
import { Typewriter } from '@/components/ui/@custom/type-writter'
import React from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { v4 as uuid } from 'uuid'

type SyncProcessState = {
	id: number
	name: string
	status: 'processing' | 'waiting' | 'completed' | 'failed' | 'cancelled'
}

const SyncDataTrigger: React.FC = () => {
	const { t } = useTranslation()
	const { data, emit } = useSocketIo<SyncProcessState[]>({ event: 'sync_decker_data' })

	return (
		<Div as='section' className='flex w-full flex-col gap-y-3'>
			<Typography className='inline-flex items-center gap-x-2 text-lg font-semibold sm:text-base md:text-base'>
				{t('ns_inoutbound:scanner_setting.data_synchronization')}
			</Typography>
			<Div className='flex flex-col items-stretch gap-6'>
				<Div className='grid grid-cols-[3fr,1fr] gap-4'>
					<Div className='space-y-1'>
						<Typography variant='small' className='inline-flex items-center gap-x-3 font-semibold'>
							{t('ns_inoutbound:scanner_setting.synchronization_trigger')}
						</Typography>
						<Typography variant='small' color='muted' className='block text-pretty'>
							{t('ns_inoutbound:scanner_setting.synchronization_trigger_description')}
						</Typography>
					</Div>
					<Button variant='outline' size='sm' onClick={() => emit(uuid())}>
						{t('ns_common:actions.trigger')}
					</Button>
				</Div>
				{Array.isArray(data) && data.length > 0 ? (
					<StepList className=''>
						{data.map((item, index) => {
							const icon: Record<
								SyncProcessState['status'],
								{ icon: React.ComponentProps<typeof Icon>['name']; color: string }
							> = {
								processing: { icon: 'LoaderCircle', color: 'hsl(var(--foreground))' },
								completed: { icon: 'CircleCheckBig', color: 'hsl(var(--success))' },
								failed: { icon: 'CircleX', color: 'hsl(var(--destructive))' },
								cancelled: { icon: 'CircleMinus', color: 'hsl(var(--muted-foreground))' },
								waiting: { icon: 'CircleDot', color: 'hsl(var(--foreground))' }
							}
							return (
								<StepItem
									key={item.id}
									style={{
										animationFillMode: 'both',
										animationDelay: (index + 1) * 300 + 'ms'
									}}>
									<Div className='translate-y-1.5'>
										<Icon
											name={icon[item.status].icon}
											stroke={icon[item.status].color}
											className={cn({
												'animate-[spin_1s_linear_infinite]': item.status === 'processing'
											})}
											size={18}
										/>
									</Div>
									<Typewriter
										delay={(index + 1) * 300}
										className='line-clamp-1 w-full animate-typing whitespace-pre-wrap'
										text={t(item.name, { ns: 'ns_rfid', defaultValue: item.name })}
									/>
								</StepItem>
							)
						})}
					</StepList>
				) : (
					<Div className='grid h-48 place-content-center rounded-md bg-muted text-center text-sm text-muted-foreground'>
						{t('ns_rfid:no_sync_process')}
					</Div>
				)}
			</Div>
		</Div>
	)
}

const StepList = tw.ul`bg-secondary p-4 flex min-h-48 flex-col gap-y-3 overflow-y-auto transition-height duration-300 ease-out rounded-[var(--radius)]`
const StepItem = tw.li`flex items-start text-sm gap-2 duration-300 ease-out animate-in fade-in-0`

export default SyncDataTrigger
