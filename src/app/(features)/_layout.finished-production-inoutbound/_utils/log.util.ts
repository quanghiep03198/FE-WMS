import { Json } from '@/common/utils/json'

type LoggerParameters = {
	status: number
	duration: number
	data: any
}

export default function createLogger({ status, duration, data }: LoggerParameters): string {
	return /* template */ `
   <span>[SSE] /api/rfid/sse</span>  
   <span class='text-success'>${status}</span> ~ 
   <span>${duration.toFixed(2)} ms</span> - 
   <span>${Json.getContentSize(data, 'kilobyte')}</span>
   `
}
