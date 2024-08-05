package protomock

import (
	"fmt"

	"go.uber.org/mock/gomock"
	"google.golang.org/protobuf/proto"
)

// matcher is used along with gomock.EXPECT() statements. Protobufs can sometimes fail to match with a standard matcher
// ex: myService.EXPECT().Command(gomock.Any(), NewProtoMatcher(request)).Return(response, nil).AnyTimes()
type matcher struct {
	proto.Message
}

// Eq returns a matcher suitable for use in gomock.Select()
// ex: mockThing.EXPECT().Fn(gomock.Any(), Eq(pkg.YourMessage{ ... })).Return(nil).AnyTimes()
func Eq(p proto.Message) gomock.Matcher {
	return &matcher{
		Message: p,
	}
}

// Matches returns true if v is a protobuf and the contents match the one in the matcher. Returns false if v is not a proto.Message
func (m *matcher) Matches(v interface{}) bool {
	vp, ok := v.(proto.Message)
	if !ok {
		return false
	}
	return proto.Equal(vp, m.Message)
}

func (m *matcher) String() string {
	return fmt.Sprintf("%v (%T)", m.Message, m.Message)
}
