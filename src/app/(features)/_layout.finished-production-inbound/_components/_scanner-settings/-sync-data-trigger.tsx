import { RequestHeaders, RequestMethod } from '@/common/constants/enums'
import { FatalError, RetriableError } from '@/common/errors'
import { useAuth } from '@/common/hooks/use-auth'
import { cn } from '@/common/utils/cn'
import env from '@/common/utils/env'
import { Button, Div, Icon, Tooltip, Typography } from '@/components/ui'
import { ThirdPartyApiService } from '@/services/third-party-api.service'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useResetState } from 'ahooks'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../../_contexts/-page-context'

type SyncProcessState = {
	id: number
	name: string
	status: 'processing' | 'waiting' | 'completed' | 'failed' | 'cancelled'
}

const SyncDataTrigger: React.FC = () => {
	const { t, i18n } = useTranslation()
	const [state, setState, resetState] = useResetState<SyncProcessState[]>([])
	const { user, token } = useAuth()
	const { connection } = usePageContext('connection')
	const abortControllerRef = useRef<AbortController>(null)

	const triggerSyncData = async () => {
		try {
			await ThirdPartyApiService.syncDeckerData(connection, user.company_code)
		} catch {
			toast.error(t('ns_common:notification.error'))
		}
	}

	// * Fetch server-sent event
	const fetchServerEvent = async () => {
		abortControllerRef.current = new AbortController()

		try {
			await fetchEventSource(env('VITE_API_BASE_URL') + '/third-party-api/sync-state', {
				method: RequestMethod.GET,
				headers: {
					[RequestHeaders.AUTHORIZATION]: `Bearer ${token}`,
					[RequestHeaders.TENANT_ID]: connection,
					[RequestHeaders.USER_COMPANY]: user.company_code,
					[RequestHeaders.ACCEPT_LANGUAGE]: i18n.language
				},
				signal: abortControllerRef.current?.signal,
				openWhenHidden: true,
				onmessage(event) {
					setState(JSON.parse(event.data) satisfies SyncProcessState[])
				},
				onclose() {
					throw new RetriableError()
				},
				onerror(error) {
					// * Depend on error type, retry or not
					if (error instanceof FatalError) throw error
					else throw new RetriableError()
				}
			})
		} catch {
			throw new RetriableError()
		}
	}

	const handleRefresh = () => {
		abortControllerRef.current.abort()
		fetchServerEvent()
		resetState()
	}

	useEffect(() => {
		if (connection) fetchServerEvent()
	}, [connection, abortControllerRef])

	return (
		<Div as='section' className='flex w-full flex-col gap-y-3'>
			<Typography className='inline-flex items-center gap-x-2 text-lg font-semibold sm:text-base md:text-base'>
				{t('ns_inoutbound:scanner_setting.data_synchronization')}
			</Typography>
			<Div className='flex flex-col items-stretch gap-6 rounded-md border p-4'>
				<Div className='grid grid-cols-[3fr,1fr] gap-4'>
					<Div className='space-y-1'>
						<Typography variant='small' className='inline-flex items-center gap-x-3 font-semibold'>
							{t('ns_inoutbound:scanner_setting.synchronization_trigger')}
							<Tooltip
								message={t('ns_common:actions.reload')}
								triggerProps={{ asChild: true }}
								contentProps={{ side: 'top', sideOffset: 8 }}>
								<button onClick={() => handleRefresh()}>
									<Icon name='RotateCw' stroke='hsl(var(--active))' />
								</button>
							</Tooltip>
						</Typography>
						<Typography variant='small' color='muted' className='text-pretty'>
							{t('ns_inoutbound:scanner_setting.synchronization_trigger_description')}
						</Typography>
					</Div>
					<Button variant='outline' size='sm' onClick={() => triggerSyncData()}>
						{t('ns_common:actions.trigger')}
					</Button>
				</Div>
				{Array.isArray(state) && state.length > 0 ? (
					<StepList className='flex min-h-40 flex-col gap-y-4 overflow-y-auto'>
						{state.map((item, index) => {
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
										animationDelay: `${index / 5 + 0.5}s`,
										animationFillMode: 'both'
									}}>
									<Div className='translate-y-px'>
										<Icon
											name={icon[item.status].icon}
											stroke={icon[item.status].color}
											className={cn({ 'animate-spin': item.status === 'processing' })}
											size={18}
										/>
									</Div>
									{t(item.name, { ns: 'ns_rfid', defaultValue: item.name })}
								</StepItem>
							)
						})}
					</StepList>
				) : (
					<Div className='grid h-32 place-content-center rounded-md bg-muted text-center text-sm text-muted-foreground'>
						{t('ns_rfid:no_sync_process')}
					</Div>
				)}
			</Div>
		</Div>
	)
}

const StepList = tw.ul`grid gap-y-4 bg-secondary rounded-md p-4`
const StepItem = tw.li`animate-[fade-in_0.5s_ease_0.25s_both] flex items-start text-sm gap-2 text-ellipsis text-pretty`

export default SyncDataTrigger
