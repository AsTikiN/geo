# Step 1: Build the app
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn prisma generate
RUN yarn prisma db push     # Create dev.db inside container if not copied
RUN yarn build

# Step 2: Run the app
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["yarn", "start"]
