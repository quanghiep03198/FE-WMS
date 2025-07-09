/* eslint-disable @typescript-eslint/no-empty-object-type */
/// <reference types="vite/client" />

interface ImportMetaEnv extends InternalImportMetaEnv {
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
