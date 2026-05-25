# ── Stage 1: Build ───────────────────────────────────────────────────────────
# Dùng Node Alpine (nhỏ gọn) để cài dependencies và build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files trước — tận dụng Docker layer cache
# Nếu package.json không đổi, bước npm install sẽ được cache lại
COPY package.json package-lock.json ./

RUN npm ci --frozen-lockfile

# Copy source code và build
COPY . .
RUN npm run build
# Kết quả: thư mục /app/dist chứa static files


# ── Stage 2: Serve ───────────────────────────────────────────────────────────
# Dùng Nginx Alpine (~25MB) để serve static files — không cần Node nữa
FROM nginx:1.27-alpine AS runner

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output từ stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx chạy trên port 80
EXPOSE 80

# Healthcheck: kiểm tra Nginx đang phục vụ request
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
