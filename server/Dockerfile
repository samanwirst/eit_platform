FROM oven/bun

COPY package.json ./

RUN bun install

COPY . .

CMD ["bun" "run" "app.ts"]
