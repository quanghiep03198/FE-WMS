import { useGetTenantByFactory } from '@/app/(features)/_apis/use-tenacy.api'
import { RequestHeaders, RequestMethod } from '@/common/constants/enums'
import { FatalError, RetriableError } from '@/common/errors'
import { useAuth } from '@/common/hooks/use-auth'
import env from '@/common/utils/env'
import { Button, Div, Icon, Typography } from '@/components/ui'
import { ThirdPartyApiService } from '@/services/third-party-api.service'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

type SyncProcessState = {
	id: number
	name: string
	status: 'processing' | 'waiting' | 'completed' | 'failed' | 'cancelled'
}

const SyncDataTrigger: React.FC = () => {
	const { t } = useTranslation()
	const [state, setState] = useState<SyncProcessState[]>([])
	const { user, token } = useAuth()
	const { data: tenants } = useGetTenantByFactory()

	const currentTenant = useMemo(() => {
		if (Array.isArray(tenants) && tenants.length > 0) {
			return tenants.find((item) => item.factories.join('') === user.company_code)
		} else {
			return null
		}
	}, [tenants, user.company_code])

	console.log(currentTenant)

	const triggerSyncData = async () => {
		try {
			await ThirdPartyApiService.syncDeckerData(currentTenant?.id, user.company_code)
		} catch {
			console.log('Failed to trigger sync data')
		}
	}

	// * Fetch server-sent event
	const fetchServerEvent = async () => {
		try {
			await fetchEventSource(env('VITE_API_BASE_URL') + '/third-party-api/sync-state', {
				method: RequestMethod.GET,
				headers: {
					[RequestHeaders.AUTHORIZATION]: `Bearer ${token}`,
					[RequestHeaders.TENANT_ID]: currentTenant?.id,
					[RequestHeaders.USER_COMPANY]: user.company_code
				},
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

	useEffect(() => {
		if (currentTenant) fetchServerEvent()
	}, [currentTenant])

	return (
		<Div as='section' className='flex w-full flex-col gap-y-3'>
			<Typography className='inline-flex items-center gap-x-2 text-lg font-semibold sm:text-base md:text-base'>
				{t('ns_inoutbound:scanner_setting.data_synchronization')}
			</Typography>
			<Div className='flex flex-col items-stretch gap-6 rounded-md border p-4'>
				<Div className='grid grid-cols-[3fr,1fr] gap-4'>
					<Div className='space-y-1'>
						<Typography variant='small' className='font-semibold'>
							{t('ns_inoutbound:scanner_setting.synchronization_trigger')}
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
					<StepList className='grid h-32 gap-y-4'>
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
									<Icon
										name={icon[item.status].icon}
										stroke={icon[item.status].color}
										className={item.status === 'processing' && 'animate-spin'}
										size={18}
									/>
									{item.name}
								</StepItem>
							)
						})}
					</StepList>
				) : (
					<Div className='grid h-32 place-content-center rounded-md bg-muted text-center text-sm text-muted-foreground'>
						No sync process is running
					</Div>
				)}
			</Div>
		</Div>
	)
}

const StepList = tw.ul`grid gap-y-4 bg-secondary rounded-md p-4`
const StepItem = tw.li`animate-[fade-in_0.75s_ease-out] flex items-center text-sm gap-2 text-ellipsis`

export default SyncDataTrigger
