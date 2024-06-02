export declare global {
	type AnonymousFunction = (...args: any[]) => any;

	type Locale = 'vi' | 'en' | 'cn';

	type Pagination<T> = {
		docs: Array<T>;
		hasNextPage: boolean;
		hasPrevPage: boolean;
		limit: number;
		page: number;
		totalDocs: number;
		totalPages: number;
	};
}
