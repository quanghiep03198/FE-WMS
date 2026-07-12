export enum ScannedStatus {
	SCANNED = 'scanned',
	UNSCANNED = 'unscanned'
}

export enum StockFlow {
	INBOUND = 'inbound',
	OUTBOUND = 'outbound'
}

export enum ScanCapability {
	SCANNABLE = 'scannable',
	UNSCANNABLE = 'unscannable'
}

export enum FinishedGoodsAction {
	IMPORT = 'A',
	EXPORT = 'B'
}

export enum FinishedGoodsOutboundReason {
	NORMAL_IMPORT = 'A',
	RECYCLE_EXPORT = 'C'
}
