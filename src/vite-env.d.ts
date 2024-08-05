/// <reference types="vite/client" />

interface ImportMetaEnv extends InternalImportMetaEnv {
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
