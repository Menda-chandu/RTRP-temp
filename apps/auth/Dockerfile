FROM node:20-slim

WORKDIR /app

# Copy root package.json for concurrently if needed (but here we run standalone)
# Better to just copy auth specific files
COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

# Ensure we use the correct port
ENV PORT=4000
EXPOSE 4000

CMD ["node", "server.js"]
