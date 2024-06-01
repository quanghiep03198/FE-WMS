import { PropsWithChildren, createContext, useRef, useState } from 'react';

type TableProviderProps = {
	areAllFiltersCleared: boolean;
} & PropsWithChildren;

type TableContext = {
	isScrolling: boolean;
	isFilterOpened: boolean;
	handleScroll: () => void;
	setIsFilterOpened: React.Dispatch<React.SetStateAction<boolean>>;
} & Pick<TableProviderProps, 'areAllFiltersCleared'>;

export const TableContext = createContext<TableContext>({
	isScrolling: false,
	isFilterOpened: false,
	areAllFiltersCleared: false,
	setIsFilterOpened: () => {},
	handleScroll: () => {}
});

export const TableProvider: React.FC<TableProviderProps> = ({ areAllFiltersCleared, children }) => {
	const [isScrolling, setIsScrolling] = useState(false);
	const [isFilterOpened, setIsFilterOpened] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleScroll = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current!);
		setIsScrolling(true);
		timeoutRef.current = setTimeout(() => {
			setIsScrolling(false);
		}, 100);
	};

	return (
		<TableContext.Provider
			value={{
				isScrolling,
				areAllFiltersCleared,
				isFilterOpened,
				setIsFilterOpened,
				handleScroll
			}}>
			{children}
		</TableContext.Provider>
	);
};
