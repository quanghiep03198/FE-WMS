import { ProductionApproveStatus } from '@/common/constants/enums'
import { IInOutBoundOrder } from '@/common/types/entities'

export const production: IInOutBoundOrder[] = Array.from(new Array(500)).map((_, index) => ({
	id: String(index),
	status_approve: ProductionApproveStatus.REVIEWED,
	sno_no: crypto.randomUUID(),
	sno_date: new Date(),
	sno_car_number: crypto.randomUUID(),
	sno_ship_order: crypto.randomUUID(),
	sno_container: crypto.randomUUID(),
	sno_sealnumber: crypto.randomUUID(),
	sno_qty: crypto.randomUUID(),
	sno_total_boxes: Math.round(Math.random() * 1000),
	dept_name: 'Example Department',
	employee_name: `Employee 00${Math.round(Math.random() * 100)}`
}))
