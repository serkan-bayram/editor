# Base image olarak Node.js kullanıyoruz
FROM node:18-alpine AS builder

# Çalışma dizinini belirleyelim
WORKDIR /app

# Bağımlılıkları yükleme ve build için package.json ve package-lock.json dosyalarını kopyalayalım
COPY package.json package-lock.json ./
RUN npm ci

# Proje dosyalarını kopyalayalım
COPY . .

# Next.js uygulamasını build edelim
RUN npm run build

# Production için lightweight bir image kullanıyoruz
FROM node:18-alpine AS runner
WORKDIR /app

# Production ortamı değişkenlerini ayarlayalım
ENV NODE_ENV=production

# node_modules klasörünü ve Next.js build dosyalarını kopyalayalım
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# Next.js uygulamasını başlatalım
CMD ["npm", "start"]
