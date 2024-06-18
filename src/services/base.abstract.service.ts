export abstract class BaseAbstractService {
	protected static createEndpoint(...params: any[]) {
		return params.join('/')
	}
}
