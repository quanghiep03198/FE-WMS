export abstract class BaseAbstractService {
	static BASE_ENDPOINT

	protected static createEndpoint(...params: any[]) {
		return [BaseAbstractService.BASE_ENDPOINT, params].join('/')
	}
}
