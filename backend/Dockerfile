# backend/Dockerfile
FROM rust:1.68 AS builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:buster-slim
WORKDIR /app
COPY --from=builder /app/target/release/backend /app/backend
CMD ["./backend"]
