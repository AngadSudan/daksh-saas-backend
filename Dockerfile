FROM node:22-alpine 

WORKDIR /app 

COPY package* . 
RUN npx prisma generate
RUN npm run build

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev:docker"]