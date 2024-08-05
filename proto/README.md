# GRPC and Protobuf

Install `protoc` and the go generators. [Installation instructions](https://grpc.io/docs/languages/go/quickstart/)

```shell
go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
```

From this proto folder, run the following

```shell
protoc --go_out=../backend/internal/whattimeisit --go_opt=paths=source_relative \
    --go-grpc_out=../backend/internal/whattimeisit --go-grpc_opt=paths=source_relative \
    *.proto
```
