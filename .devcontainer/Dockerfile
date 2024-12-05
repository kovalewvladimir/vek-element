FROM node:22

# Пакет npm-check-updates позволяет проверять и обновлять зависимости пакетов npm.
RUN npm install -g npm-check-updates
# Пакет chokidar позволяет отслеживать изменения файлов в реальном времени.
RUN npm install -g chokidar-cli

# vite-plugin-checker editor
ENV LAUNCH_EDITOR=code

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true
