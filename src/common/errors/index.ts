export class RetriableError extends Error {}
export class FatalError extends Error {}
export class UnauthorizedError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'UnauthorizedError'
	}
}
