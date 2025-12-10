FROM node:22

# Install dependencies and LibreOffice
RUN apt-get update && \
    apt-get install -y libreoffice libreoffice-writer libreoffice-calc libreoffice-impress \
    fonts-dejavu-core fonts-dejavu-extra \
    default-jre xvfb wget unzip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Redis (server + CLI)
RUN apt-get update && \
    apt-get install -y redis-server redis-tools && \
    rm -rf /var/lib/apt/lists/*

# Install canvas dependencies
RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    libpango1.0-dev \
    libpng-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libpixman-1-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend ./apps/backend
COPY packages ./packages

RUN pnpm install

WORKDIR /usr/src/app/apps/backend

EXPOSE 8000
CMD ["sh", "-c", "redis-server --daemonize yes && pnpm run start:production"]