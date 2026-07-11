import { useMemo } from 'react'

export default function usePagination<T>(input: Array<T>, page: number, limit: number) {
	return useMemo(() => {
		const totalDocs = input.length
		const totalPages = Math.ceil(input.length / limit)
		return {
			data: input.slice((page - 1) * limit, page * limit),
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
			limit,
			page,
			totalDocs,
			totalPages
		}
	}, [input, page, limit])
}
