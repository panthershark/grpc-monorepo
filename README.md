# Overview

This monorepo shows how to setup a basic GRPC server using Go and a simple frontend using Preact.

## Hacking

To run the backend, create a local database container, then migrate up.

1. Run either `go run cmd/server/main.go` or `make run` from the api folder.
2. To test the GRPC calls, run `grpcui -plaintext localhost:4011` in another terminal

To run the frontend, start from the `./frontend` folder.

```shell
npm install
npm run dev -w app
```

Open the link in the terminal, typically http://localhost:8081/
