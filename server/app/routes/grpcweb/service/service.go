package service

import (
	"___TEMPLATE_REPO_URL___/app/routes/grpcweb/service/proto"

	"google.golang.org/grpc"
)

func Register(s grpc.ServiceRegistrar) error {
	echo, err := newEcho()
	if err != nil {
		return err
	}
	
	proto.RegisterEchoServiceServer(s, echo)

	return nil
}
