import z from 'zod'

export const isIPv4 = (ip: string): boolean => {
	return z.ipv4().safeParse(ip).success
}
