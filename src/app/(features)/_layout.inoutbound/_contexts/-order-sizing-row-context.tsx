import { createContext, useCallback, useContext, useMemo, useState } from 'react'

type OrderSizingRowContextType = {
	isEditing: boolean
	handleToggleEditing: () => void
}

const OrderSizingRowContext = createContext<OrderSizingRowContextType>(null)

export const OrderSizingRowProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [isEditing, setIsEditing] = useState<boolean>(false)

	const handleToggleEditing = useCallback(() => setIsEditing((prev) => !prev), [])

	const contextValue = useMemo(
		() => ({
			isEditing,
			handleToggleEditing
		}),
		[isEditing]
	)

	return <OrderSizingRowContext.Provider value={contextValue}>{children}</OrderSizingRowContext.Provider>
}

export const useOrderSizingRowContext = () => useContext(OrderSizingRowContext)
