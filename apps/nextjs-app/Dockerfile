# Dockerfile2

FROM node:20-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Define build arguments
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ENABLE_API_MOCKING
ARG NEXT_PUBLIC_MOCK_API_PORT
ARG NEXT_PUBLIC_URL

WORKDIR /app

# Copy package.json adn yarn.lock to /app in docker directory
COPY package.json yarn.lock ./

# Run installation 
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# Copy working directory
COPY . .

# Set environment variables 
ENV NEXT_PUBLIC_API_URL ${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_ENABLE_API_MOCKING ${NEXT_PUBLIC_ENABLE_API_MOCKING}
ENV NEXT_PUBLIC_MOCK_API_PORT ${NEXT_PUBLIC_MOCK_API_PORT}
ENV NEXT_PUBLIC_URL ${NEXT_PUBLIC_URL}

# Run build
RUN pnpm run build

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports
EXPOSE 3002

CMD ["pnpm", "start"]

# Run the application using supervisord
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
