package whattimeisit

import (
	context "context"
	"errors"
)

type server struct {
	UnimplementedWhatTimeIsItServiceServer
}

func NewWhatTimeIsItApiServer() *server {
	return &server{}
}

func (s *server) WhatTimeIsItRightNow(context.Context, *WhatTimeIsItRightNowRequest) (*WhatTimeIsItRightNowResponse, error) {
	return nil, errors.New("not impl")
}

func (s *server) WhatTimeIsItRightNowStream(*WhatTimeIsItRightNowStreamRequest, WhatTimeIsItService_WhatTimeIsItRightNowStreamServer) error {
	return errors.New("not impl")
}
