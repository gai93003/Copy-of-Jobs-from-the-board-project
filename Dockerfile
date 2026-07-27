FROM node:22-bookworm-slim

WORKDIR /app

COPY Jobs-board-backend/package.json ./Jobs-board-backend/package.json
COPY Jobs-board-frontend/package.json ./Jobs-board-frontend/package.json

RUN cd Jobs-board-backend && npm install --omit=dev \
    && cd ../Jobs-board-frontend && npm install

COPY Jobs-board-backend ./Jobs-board-backend
COPY Jobs-board-frontend ./Jobs-board-frontend

EXPOSE 5173 5501

ENV HOST=0.0.0.0
ENV PORT=5501

CMD ["sh", "-c", "cd /app/Jobs-board-backend && npm start & cd /app/Jobs-board-frontend && npm run dev -- --host 0.0.0.0 --port 5173 && wait"]