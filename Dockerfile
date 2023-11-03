FROM golang:latest AS builder

WORKDIR /app
COPY . /app
RUN go build .

FROM debian:latest AS runner
WORKDIR /app
COPY --from=builder /app/wave2attend /app/wave2attend
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["/app/wave2attend"]
