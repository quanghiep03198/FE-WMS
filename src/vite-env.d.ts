/// <reference types="vite/client" />

interface ImportMetaEnv extends GlobalImportMetaEnv {
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
