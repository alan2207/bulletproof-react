# Install node dependency
FROM node:20-alpine
# Install supervisor
RUN apk add --no-cache supervisor

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Define build arguments
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ENABLE_API_MOCKING
ARG NEXT_PUBLIC_MOCK_API_PORT
ARG NEXT_PUBLIC_URL

WORKDIR /app

# Copy package.json and pnpm-lock.yml to /app in docker directory
COPY package.json pnpm-lock.yaml ./

# Run installation 
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy working directory
COPY . .

# Set environment variables 
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_ENABLE_API_MOCKING=${NEXT_PUBLIC_ENABLE_API_MOCKING}
ENV NEXT_PUBLIC_MOCK_API_PORT=${NEXT_PUBLIC_MOCK_API_PORT}
ENV NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL}


RUN cat package.json

# Run build
RUN pnpm run build

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports
EXPOSE 3001 8081

# Run the application using supervisord
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
