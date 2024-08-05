package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"strconv"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/panthershark/grpc-monorepo/backend/internal/whattimeisit"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

func main() {
	serverPort, err := strconv.ParseInt(os.Getenv("PORT"), 10, 64)
	if err != nil {
		log.Println("port invalid. setting port automatically")
		serverPort = 4011
	}

	lis, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%d", serverPort+1))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	timeApi := whattimeisit.NewWhatTimeIsItApiServer()
	whattimeisit.RegisterWhatTimeIsItServiceServer(s, timeApi)
	reflection.Register(s)

	go func() {
		log.Printf("grpc server listening at %v", lis.Addr())

		if err := s.Serve(lis); err != nil {
			log.Fatalf("failed to serve: %v", err)
		}
	}()

	// gRPC web code
	grpcWebServer := grpcweb.WrapServer(s,

		// Enable CORS
		grpcweb.WithOriginFunc(func(origin string) bool {
			return true
		}),
	)

	srv := &http.Server{
		Handler: grpcWebServer,
		Addr:    fmt.Sprintf("0.0.0.0:%d", serverPort),
	}

	log.Printf("http server listening at %v", srv.Addr)
	log.Println("cors enabled. hosts: *")
	if err := srv.ListenAndServe(); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}

}
