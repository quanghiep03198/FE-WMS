#!/bin/bash
chmod +x deploy.sh

APP_NAME="wms-client"             # Tên của ứng dụng trong PM2
DIST_DIR="dist"                   # Thư mục chứa kết quả build

# Reset lại code về trạng thái origin/develop
echo "Resetting code to origin/develop..."
git fetch origin
git reset --hard origin/develop

# Pull code mới nhất từ develop
echo "Pulling latest code from develop..."
git pull origin develop

# Cài đặt dependencies
echo "Installing dependencies..."
npm ci

# Tạo PWA assets (nếu có)
echo "Generating PWA assets..."
npm run generate-pwa-assets

# Build ứng dụng React
echo "Building the React app..."
npm run build


# Kiểm tra xem thư mục dist đã được tạo chưa
if [ ! -d "dist" ]; then
  echo "Error: Build failed, 'dist' directory does not exist."
  exit 1
fi

# Cấp quyền ghi đè cho thư mục dist (full control cho mọi người)
echo "Granting write permission to the dist folder..."
if [ -d "$DIST_DIR" ]; then
  chmod -R 777 "$DIST_DIR"
  echo "Write permissions granted for $DIST_DIR."
else
  echo "No dist directory found. Build will create a new one."
fi


# Khởi động lại ứng dụng bằng PM2
echo "Restarting the app using PM2..."
pm2 restart "$APP_NAME" --update-env

# Hiển thị trạng thái của PM2 để xác nhận ứng dụng đã chạy lại
echo "PM2 status:"
pm2 status "$APP_NAME"
