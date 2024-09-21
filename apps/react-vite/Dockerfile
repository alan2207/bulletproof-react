# Install node
FROM node:20-alpine

# Install supervisor
RUN apk add --no-cache supervisor

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


WORKDIR /app

# Copy package.json and pnpm-lock.yml to /app in docker directory
COPY package.json pnpm-lock.yaml ./

# Run installation 
RUN pnpm install --frozen-lockfile

# Copy working directory
COPY . .

ENV VITE_APP_API_URL=http://localhost:8080/api
ENV VITE_APP_ENABLE_API_MOCKING=true
ENV VITE_APP_MOCK_API_PORT=8080

# Run build
RUN pnpm run build

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports
EXPOSE 3000 8080

# Run the application using supervisord
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
