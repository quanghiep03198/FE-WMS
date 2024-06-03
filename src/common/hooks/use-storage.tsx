import React, { useCallback, useState, useEffect } from 'react';
import { JsonHandler } from '../utils/json-handler';

function useStorage<T>(
	key: string,
	defaultValue: T,
	storageObject: Storage
): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>, () => void] {
	const [value, setValue] = useState<T | undefined>(() => {
		const storedValue = storageObject.getItem(key);
		if (typeof window === 'undefined') return defaultValue;

		switch (true) {
			case typeof storedValue === 'string' && !JsonHandler.isValid(storedValue):
				return storedValue;
			case JsonHandler.isValid(storedValue):
				return JsonHandler.safeParse(storedValue!);
			case typeof defaultValue === 'function':
				return defaultValue();
			default:
				return defaultValue;
		}
	});

	useEffect(() => {
		(function () {
			try {
				if (value === undefined) return storageObject.removeItem(key);
				storageObject.setItem(key, JSON.stringify(value));
			} catch (error) {
				console.log((error as Error).message);
			}
		})();
	}, [key, value, storageObject]);

	const remove = useCallback(() => {
		setValue(undefined);
	}, []);

	return [value, setValue, remove];
}

export function useLocalStorage<T>(key: string, defaultValue?: T) {
	return useStorage(key, defaultValue, window.localStorage);
}

export function useSessionStorage<T>(key: string, defaultValue?: T) {
	return useStorage(key, defaultValue, window.sessionStorage);
}
