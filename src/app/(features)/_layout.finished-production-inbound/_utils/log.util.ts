import { Json } from '@/common/utils/json'

type LoggerParameters = {
	status: number
	duration: number
	data: any
}

export default function createLogger({ status, duration, data }: LoggerParameters): string {
	return /* template */ `
   <span>[SSE] /api/rfid/sse</span>  
   <span data-status='${status}' class='data-[status=200]:text-success text-destructive'>${status}</span> ~ 
   <span>${duration.toFixed(2)} ms</span> - 
   <span>${Json.getContentSize(data, 'kilobyte')}</span>
   `
}
