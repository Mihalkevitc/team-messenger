FROM node:18-alpine

# Создаем рабочую директорию
WORKDIR /app

# Копируем ТОЛЬКО package.json сначала
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы сервера
COPY . .

EXPOSE 5000
CMD ["npm", "start"]