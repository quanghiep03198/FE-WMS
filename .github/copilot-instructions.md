# Tên dự án

Frontend WMS - Warehouse Management System

## 1. Tổng quan

Giao diện người dùng cho hệ thống quản lý kho hàng, giúp người dùng theo dõi tồn kho, đơn hàng và các hoạt động liên quan đến kho.

## 2. Tech stack

React, TypeScript, Vite, Shadcn UI (Radix based), Tailwind CSS, Tanstack (router, query, table, virtualization), Zustand, I18next, IIS Server, SonarQube, Sentry

## 3. Cấu trúc thư mục

- `.github/`: các file cấu hình GitHub, bao gồm workflow và copilot instructions
- `infrastructure/`: các file cấu hình và triển khai hạ tầng của dự án
- `public/`: chứa các tài nguyên tĩnh như hình ảnh, favicon, và các file tĩnh khác
- `src/`: mã nguồn chính của dự án
- `test/`: các file test của dự án

## 4. Lệnh thường dùng

- Cài đặt: `pnpm install`
- Chạy dev: `pnpm dev`
- Test: `pnpm test`
- Lint/typecheck: `pnpm lint && pnpm typecheck`

## 5. Quy ước code

- TypeScript strict, không dùng `any`
- Đặt tên file: kebab-case; component: PascalCase
- Sử dụng hooks và functional component thay vì class component
- Tách biệt rõ ràng giữa UI và logic
- Sử dụng Zustand cho state management
- Sử dụng Tanstack Query cho các thao tác với API
- Sử dụng I18next cho đa ngôn ngữ

## 6. Quy tắc quan trọng

**Nên làm:**

- Dùng hooks và functional component cho mọi UI
- Tách biệt rõ ràng giữa UI và logic
- Luôn triển khai theo hướng Atomic Design, phân tách các component thành các cấp độ Atom, Molecule, Organism, Template, Page
- Sử dụng Zustand cho state management
- Sử dụng Tanstack Query cho các thao tác với API
- Sử dụng I18next cho đa ngôn ngữ
- Sử dụng Playwright cho các end-to-end test
- Sử dụng Shadcn UI cho các component giao diện người dùng
- Sử dụng Tailwind CSS cho việc tạo kiểu giao diện người dùng
- Sử dụng tools Agent như `/unslop` cải thiện giao diện người dùng
- Form submit nên được xử lý thông quan react hook form và các validation schema qua Zod
- Luôn kiểm tra và tối ưu rerender của các component React, cũng như DOM size để đảm bảo hiệu năng của ứng dụng
- Không lạm dụng useEffect, chỉ dùng khi thực sự cần thiết.
- Viết test cho các component và logic mới
-

**Không được làm:**

- Không sửa các file migration cũ
- Không commit file `.env.development` và các file `.env` khác chứa thông tin nhạy cảm, trừ file `.env.example` (đây là file env mẫu)
- Không thêm thư viện mới khi chưa hỏi

## 7. Quy trình làm việc

- Đọc code liên quan trước khi sửa
- Sau khi sửa phải chạy typecheck và test
- Commit message theo Conventional Commits
