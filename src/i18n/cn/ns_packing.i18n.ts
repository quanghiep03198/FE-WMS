export default {
	manifest: {
		pending: '等待导出',
		processing: '正在生成 Excel',
		done: '导出完成',
		ready: 'Excel 文件已准备就绪，正在开始下载。',
		retry_download: '下载',
		failed: '导出失败',
		expired: '导出文件已过期，请重新生成。',
		progress: '导出进度',
		download: '下载 Excel',
		too_many: '已有导出任务运行中，请等待完成。',
		create_error: '无法开始导出。',
		status_error: '无法检查导出状态。',
		retry: '重试',
		list_error: '无法加载包装清单。'
	},
	titles: {
		packing_manifest: '包装清单',
		daily_weighing_report: '每日称重报告',
		file_daily_weighing_report: '称重报告 {{factory}} - {{date}}',
		file_packing_manifest: '包装清单 {{factory}}'
	},
	descriptions: {
		packing_manifest: '已打包并准备发货的货件详情',
		daily_weighing_report: '已在电子称重系统中检查和称重的货物信息'
	}
}
