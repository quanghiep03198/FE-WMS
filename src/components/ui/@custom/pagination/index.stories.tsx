import { i18n } from '@/i18n'
import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Toaster } from 'sonner'
import Pagination from './__snapshot__'

// Mock API class cho realistic network simulation
class MockPaginationApi {
	private requestLog: Array<{ timestamp: number; page: number; type: 'fetch' | 'prefetch'; success: boolean }> = []
	private stats = { fetches: 0, prefetches: 0, errors: 0 }

	async prefetchPage(page: number): Promise<void> {
		const delay = Math.random() * 600 + 200
		const willFail = Math.random() < 0.05

		this.stats.prefetches++

		await new Promise((resolve, reject) => {
			setTimeout(() => {
				this.requestLog.push({ timestamp: Date.now(), page, type: 'prefetch', success: !willFail })

				if (willFail) {
					this.stats.errors++
					reject(new Error(`Network error for page ${page}`))
				} else {
					resolve(void 0)
				}
			}, delay)
		})
	}

	getActivitySummary() {
		return this.stats
	}

	getRequestLog() {
		return this.requestLog.slice(-10).reverse()
	}

	clearLog() {
		this.requestLog = []
		this.stats = { fetches: 0, prefetches: 0, errors: 0 }
	}
}

// Query Client Provider wrapper
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 5 * 60 * 1000,
						retry: false
					}
				}
			})
	)

	return (
		<QueryClientProvider client={queryClient}>
			<I18nextProvider i18n={i18n}>
				{children}
				<Toaster />
			</I18nextProvider>
		</QueryClientProvider>
	)
}

// #region Meta Configuration

const meta: Meta<typeof Pagination> = {
	title: 'UI/Custom/Pagination',
	component: Pagination,
	decorators: [
		(Story) => (
			<AppProvider>
				<div className='min-h-screen bg-gray-50 p-8'>
					<Story />
				</div>
			</AppProvider>
		)
	],
	tags: ['autodocs'], // Tự động generate docs
	parameters: {
		layout: 'fullscreen'
	},
	argTypes: {
		page: {
			control: { type: 'number', min: 1 },
			description: 'Trang hiện tại đang được chọn',
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: '1' }
			}
		},
		totalPages: {
			control: { type: 'number', min: 1, max: 100 },
			description: 'Tổng số trang có sẵn',
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: '1' }
			}
		},
		hasNextPage: {
			control: { type: 'boolean' },
			description: 'Có trang tiếp theo hay không',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' }
			}
		},
		hasPrevPage: {
			control: { type: 'boolean' },
			description: 'Có trang trước đó hay không',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' }
			}
		},
		nextPage: {
			control: { type: 'number', min: 1 },
			description: 'Số của trang tiếp theo',
			table: {
				type: { summary: 'number | undefined' },
				defaultValue: { summary: 'undefined' }
			}
		},
		prevPage: {
			control: { type: 'number', min: 0 },
			description: 'Số của trang trước đó',
			table: {
				type: { summary: 'number | undefined' },
				defaultValue: { summary: 'undefined' }
			}
		},
		limit: {
			control: { type: 'number', min: 1, max: 100 },
			description: 'Số items mỗi trang (dùng để hiển thị thông tin)',
			table: {
				type: { summary: 'number | undefined' },
				defaultValue: { summary: '20' }
			}
		},
		totalDocs: {
			control: { type: 'number', min: 0 },
			description: 'Tổng số documents/records',
			table: {
				type: { summary: 'number | undefined' },
				defaultValue: { summary: 'undefined' }
			}
		},
		range: {
			control: { type: 'number', min: 1, max: 10 },
			description: 'Số trang hiển thị quanh trang hiện tại',
			table: {
				type: { summary: 'number | undefined' },
				defaultValue: { summary: '2' }
			}
		},
		maxContinuousPrefetch: {
			control: { type: 'number', min: 1, max: 10 },
			description: 'Max số trang prefetch liên tiếp',
			table: {
				type: { summary: 'number | undefined' },
				defaultValue: { summary: '3' }
			}
		},
		continuousInterval: {
			control: { type: 'number', min: 100, max: 2000, step: 100 },
			description: 'Interval giữa các lần prefetch (milliseconds)',
			table: {
				type: { summary: 'number | undefined' },
				defaultValue: { summary: '500' }
			}
		},
		onPageChange: {
			action: 'page-changed',
			description: 'Callback khi user click vào trang',
			table: {
				type: { summary: '(page: number) => void' },
				defaultValue: { summary: 'undefined' }
			}
		},
		onPrefetch: {
			action: 'page-prefetched',
			description: 'Callback cho prefetching khi hover',
			table: {
				type: { summary: /* ts */ `(page: number) => void | Promise<void>` },
				defaultValue: { summary: 'undefined' }
			}
		}
	}
}

export default meta

// #endregion

// #region Stories

// 1. Simple Case - Pagination cơ bản với highlighting
const SimpleTemplate: React.FC<{ totalPages: number }> = ({ totalPages }) => {
	const [currentPage, setCurrentPage] = React.useState(1)

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
	}

	return (
		<div className='space-y-6'>
			<div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
				<h3 className='mb-2 font-semibold text-blue-800'>📄 Simple Pagination Demo</h3>
				<p className='text-sm text-blue-700'>
					Click vào bất kỳ button trang nào để xem highlighting hoạt động. Trang hiện tại:{' '}
					<strong className='text-blue-900'>{currentPage}</strong>
				</p>
			</div>
			<div className='flex justify-center'>
				<Pagination
					page={currentPage}
					totalPages={totalPages}
					hasNextPage={currentPage < totalPages}
					hasPrevPage={currentPage > 1}
					nextPage={currentPage + 1}
					prevPage={currentPage - 1}
					limit={20}
					totalDocs={totalPages * 20}
					range={2}
					onPageChange={handlePageChange}
					onPrefetch={() => {}}
				/>
			</div>
		</div>
	)
}

export const Simple: StoryObj<{ totalPages: number }> = {
	render: SimpleTemplate,
	args: {
		totalPages: 15
	},
	parameters: {
		docs: {
			description: {
				story: 'Simple pagination demo với highlighting cơ bản. Click các button để xem current page thay đổi.'
			}
		}
	}
}

// 2. Mock API Case - Với prefetching và logging
const MockApiTemplate: React.FC<{ totalPages: number }> = ({ totalPages }) => {
	const [currentPage, setCurrentPage] = React.useState(1)
	const [prefetchedPages, setPrefetchedPages] = React.useState<Set<number>>(new Set())
	const [logs, setLogs] = React.useState<Array<{ timestamp: string; message: string; type: 'prefetch' | 'navigate' }>>(
		[]
	)
	const mockApi = React.useRef(new MockPaginationApi())

	const addLog = (message: string, type: 'prefetch' | 'navigate') => {
		const timestamp = new Date().toLocaleTimeString()
		setLogs((prev) => [...prev.slice(-4), { timestamp, message, type }])
	}

	const handlePageChange = async (page: number) => {
		setCurrentPage(page)
		addLog(`Navigated to page ${page}`, 'navigate')
		// Simulate page loading (không cần await vì chỉ là demo)
	}

	const handlePrefetch = async (page: number) => {
		if (prefetchedPages.has(page)) {
			addLog(`Page ${page} already prefetched (cache hit)`, 'prefetch')
			return
		}

		addLog(`Prefetching page ${page}...`, 'prefetch')
		setPrefetchedPages((prev) => new Set([...prev, page]))
		await mockApi.current.prefetchPage(page)
		addLog(`✅ Page ${page} prefetched successfully`, 'prefetch')
	}

	return (
		<div className='space-y-6'>
			<div className='rounded-lg border border-green-200 bg-green-50 p-4'>
				<h3 className='mb-2 font-semibold text-green-800'>🚀 Mock API Demo với Prefetch Logging</h3>
				<p className='text-sm text-green-700'>
					Hover vào các button để xem prefetching hoạt động. Trang hiện tại:{' '}
					<strong className='text-green-900'>{currentPage}</strong>
				</p>
			</div>

			{/* Logs Display */}
			<div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
				<h4 className='mb-2 text-sm font-semibold text-gray-700'>📋 Activity Logs:</h4>
				<div className='space-y-1 text-xs'>
					{logs.length === 0 ? (
						<p className='italic text-gray-500'>No activity yet...</p>
					) : (
						logs.map((log, index) => (
							<div
								key={index}
								className={`flex gap-2 ${log.type === 'prefetch' ? 'text-blue-600' : 'text-green-600'}`}>
								<span className='font-mono text-gray-400'>{log.timestamp}</span>
								<span className={log.type === 'prefetch' ? 'text-blue-700' : 'text-green-700'}>
									{log.message}
								</span>
							</div>
						))
					)}
				</div>
			</div>

			{/* Prefetch Status */}
			<div className='rounded-lg border border-purple-200 bg-purple-50 p-4'>
				<h4 className='mb-2 text-sm font-semibold text-purple-700'>💾 Prefetch Status:</h4>
				<div className='flex flex-wrap gap-1'>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
						<span
							key={page}
							className={`rounded px-2 py-1 text-xs ${
								prefetchedPages.has(page) ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-600'
							}`}>
							{page}
						</span>
					))}
				</div>
				<p className='mt-2 text-xs text-purple-600'>
					Prefetched: {prefetchedPages.size}/{totalPages} pages
				</p>
			</div>

			<div className='flex justify-center'>
				<Pagination
					page={currentPage}
					totalPages={totalPages}
					hasNextPage={currentPage < totalPages}
					hasPrevPage={currentPage > 1}
					nextPage={currentPage + 1}
					prevPage={currentPage - 1}
					limit={20}
					totalDocs={totalPages * 20}
					range={2}
					onPageChange={handlePageChange}
					onPrefetch={handlePrefetch}
				/>
			</div>
		</div>
	)
}

export const MockApiWithLogging: StoryObj<{ totalPages: number }> = {
	render: MockApiTemplate,
	args: {
		totalPages: 10
	},
	parameters: {
		docs: {
			description: {
				story: 'Mock API demo với prefetch logging. Hover vào các page buttons để xem prefetching hoạt động và theo dõi logs.'
			}
		}
	}
}
// #endregion
