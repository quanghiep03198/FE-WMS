import { createContext } from 'react'
import { RFIDDataType } from '../../_layout.(rfid)/-constants'

const PageContext = createContext<{ dataType: RFIDDataType }>({ dataType: null })

const PageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	return <PageContext.Provider value={{ dataType: RFIDDataType.INBOUND }}>{children}</PageContext.Provider>
}
