# Билд клиента
FROM node:18 as client-builder

WORKDIR /app
COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm install

COPY client ./client
RUN cd client && npm run build

# Билд сервера
FROM node:18 as server-builder

WORKDIR /app
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm install

COPY server ./server

# Финальный образ
FROM node:18

WORKDIR /app

# Копируем собранный клиент
COPY --from=client-builder /app/client/build ./client/build

# Копируем сервер и его зависимости
COPY --from=server-builder /app/server ./server
COPY --from=server-builder /app/server/node_modules ./server/node_modules

# Копируем package.json для возможных скриптов
COPY server/package.json ./server/

# Устанавливаем переменные окружения по умолчанию
ENV PORT=5000
ENV NODE_ENV=production
ENV CLIENT_URL=/client/build

# Открываем порт сервера
EXPOSE 5000

# Запускаем сервер
WORKDIR /app/server
CMD ["node", "server.js"]