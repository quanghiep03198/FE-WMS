import { RequestHeaders, RequestMethod } from '@common/constants/enums'
import { FatalError, RetriableError } from '@common/errors'
import env from '@common/utils/env'
import { Json } from '@common/utils/json'
import { Div, Label, Switch, Typography } from '@components/ui'
import { AppConfigs } from '@configs/app.config'
import axiosInstance from '@configs/axios.config'
import { AuthService } from '@features/auth/services/auth.service'
import useAuth from '@hooks/use-auth'
import { EventStreamContentType, fetchEventSource, type EventSourceMessage } from '@microsoft/fetch-event-source'
import { useAsyncEffect, useDebounce, useLocalStorageState, useUnmount } from 'ahooks'
import { HttpStatusCode } from 'axios'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

const EpcDeduplicationToggleBox: React.FC = () => {
	const { t } = useTranslation()
	const abortControllerRef = useRef<AbortController | null>(null)
	const [isEnabled, setIsEnabled] = useLocalStorageState<boolean>('rfid:deduplicate_inbound_epc', {
		defaultValue: true,
		listenStorageChange: true
	})
	const debouncedEnableValue = useDebounce(isEnabled, { wait: 200 })
	const { user } = useAuth()
	const retryCountRef = useRef<number>(0)

	useAsyncEffect(async () => {
		abortControllerRef.current = new AbortController()

		await fetchEventSource(AppConfigs.BASE_API_URL + '/rfid/enable-deduplicate-inbound', {
			method: RequestMethod.GET,
			credentials: 'include',
			headers: {
				[RequestHeaders.USER_REQUEST]: user?.username,
				[RequestHeaders.FACTORY_CODE]: user?.current_factory_code
			},
			async onopen(response) {
				if (
					response.ok &&
					response.headers.get('content-type') === EventStreamContentType &&
					env<RuntimeEnvironment>('VITE_NODE_ENV') === 'production'
				) {
					console.log(response.ok)
				} else if (response.status === HttpStatusCode.Unauthorized) {
					await AuthService.refreshToken(abortControllerRef.current?.signal).catch((error) => {
						throw new FatalError(error)
					})
					throw new RetriableError('JWT expired, retrying connection with new token...	')
				} else if (
					response.status >= HttpStatusCode.BadRequest &&
					response.status !== HttpStatusCode.Unauthorized
				) {
					throw new FatalError()
				} else {
					throw new RetriableError()
				}
			},
			onmessage(event: EventSourceMessage) {
				try {
					if (!event.data || !Json.isValid(event.data)) return
					const data = Json.parse<{ enabled: boolean }>(event.data)
					setIsEnabled(data.enabled)
				} catch (error) {
					throw new FatalError(error)
				}
			},
			onclose() {
				abortControllerRef.current.abort()
			},
			onerror(error: Error) {
				// * Depend on error type, retry or not
				const isRetriable = error instanceof RetriableError
				if (!isRetriable) {
					if (!abortControllerRef.current.signal.aborted) abortControllerRef.current.abort()
					//! error is fatal, rethrow the error inside the callback to stop the entire
					throw error
				}

				// * Stop retrying after 3 attempts
				retryCountRef.current += 1
				if (retryCountRef.current > 3) throw error
			}
		})
	}, [])

	useAsyncEffect(async () => {
		await axiosInstance.put<unknown, ResponseBody<number>, { enabled: boolean }>('/rfid/enable-deduplicate-inbound', {
			enabled: debouncedEnableValue
		})
	}, [debouncedEnableValue])

	useUnmount(() => {
		if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) abortControllerRef.current.abort()
	})

	return (
		<Div className='grid w-full grid-cols-[3fr_1fr] items-center rounded-md border p-4'>
			<Div className='space-y-1'>
				<Label htmlFor='toggle-deduplication-epc'>{t('ns_rfid:titles.deduplicate_epc')}</Label>
				<Typography variant='small' color='muted' className='block text-pretty'>
					{t('ns_rfid:descriptions.deduplicate_epc')}
				</Typography>
			</Div>
			<Div className='place-self-center justify-self-end'>
				<Switch
					id='toggle-deduplication-epc'
					className='max-w-full'
					defaultChecked={isEnabled}
					checked={isEnabled}
					onCheckedChange={setIsEnabled}
				/>
			</Div>
		</Div>
	)
}

export default EpcDeduplicationToggleBox
