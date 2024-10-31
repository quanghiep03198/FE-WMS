/**
 * @event
 */
export const INCOMING_DATA_CHANGE = 'INCOMING_DATA_CHANGE' as const

export enum RFIDSettings {
	SSE_POLLING_DURATION = 'rfidSettings.ssePollingDuration',
	PRESERVE_LOG = 'rfidSettings.preserveLog',
	FULLSCREEN_MODE = 'rfidSettings.fullscreenMode',
	DEVELOPER_MODE = 'rfidSettings.developerMode'
}
