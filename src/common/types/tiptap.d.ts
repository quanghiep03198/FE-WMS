export module '@tiptap/core' {
	interface Commands<ReturnType> {
		imagePlaceholder: {
			/**
			 * Inserts an image placeholder
			 */
			insertImagePlaceholder: () => ReturnType
		}
		search: {
			/**
			 * @description Set search term in extension.
			 */
			setSearchTerm: (searchTerm: string) => ReturnType
			/**
			 * @description Set replace term in extension.
			 */
			setReplaceTerm: (replaceTerm: string) => ReturnType
			/**
			 * @description Replace first instance of search result with given replace term.
			 */
			replace: () => ReturnType
			/**
			 * @description Replace all instances of search result with given replace term.
			 */
			replaceAll: () => ReturnType
			/**
			 * @description Select the next search result.
			 */
			selectNextResult: () => ReturnType
			/**
			 * @description Select the previous search result.
			 */
			selectPreviousResult: () => ReturnType
			/**
			 * @description Set case sensitivity in extension.
			 */
			setCaseSensitive: (caseSensitive: boolean) => ReturnType
		}
	}
}
