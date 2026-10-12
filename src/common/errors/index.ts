export class RetriableError extends Error {}
export class FatalError extends Error {}
export class UnauthorizedError extends Error {
	constructor(message: string) {
		super(message)
		Object.setPrototypeOf(this, UnauthorizedError.prototype)
		this.name = 'UnauthorizedError'
	}
}
export class RequestTimeoutError extends Error {
	constructor(message: string = 'Request timeout') {
		super(message)
		Object.setPrototypeOf(this, RequestTimeoutError.prototype)
		this.name = 'RequestTimeoutError'
	}
}
