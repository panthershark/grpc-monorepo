.PHONY: clean update gen test build install run purge 
all: update gen test build

ifeq ($(PREFIX),)
    PREFIX := /opt/some-app-name
endif

clean:	
	go clean --testcache -cache 
	rm -rf build

update:
	go mod tidy
	# go mod vendor
	
gen: clean update
	go generate ./...

test: update 
	podman-compose -f test-compose.yaml down --remove-orphans
	podman image rm backend_test_backend:latest
	podman-compose -f test-compose.yaml up --build --abort-on-container-exit --exit-code-from test_backend

build: 
	mkdir -p build 
	go build  -o ./build/server ./cmd/server/main.go 

install: build
	install -m 755 server $(PREFIX)/bin/
	install -m 644 etc/.env $(PREFIX)/etc/

run:
	go run ./cmd/server/main.go

purge:
	rm -rf $(PREFIX)