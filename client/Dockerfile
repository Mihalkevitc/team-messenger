FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
# Копируем исходный код и собираем проект
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]