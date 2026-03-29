import { createContext } from 'react'
import type { OrderItem } from '../..'

export const DecentralizedPoFormContext = createContext<Pick<OrderItem, 'sizes'>>(null)

export const DecentralizedPoFormProvider: React.FC<{ value: Pick<OrderItem, 'sizes'> } & React.PropsWithChildren> = ({
	value,
	children
}) => {
	return <DecentralizedPoFormContext.Provider value={value}>{children}</DecentralizedPoFormContext.Provider>
}
