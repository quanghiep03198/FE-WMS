import { useNavigate, useSearch } from '@tanstack/react-router';
import _ from 'lodash';

export default function useQueryParams() {
	const searchParams = useSearch({
		strict: false,
		select(search) {
			return Object.fromEntries(new URLSearchParams(search));
		}
	});

	const navigate = useNavigate();

	const setParams = (params: Record<string, any>) => navigate({ search: (prev) => ({ ...prev, ...params }) });

	const removeParam = (key: string) => navigate({ search: (prev) => _.omit(prev, [key]) });

	return { searchParams, setParams, removeParam };
}
