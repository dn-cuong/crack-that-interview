FROM node:23.2.0


RUN mkdir -p /app
COPY . /app

WORKDIR /app

COPY package*.json ./

RUN npm install .

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]