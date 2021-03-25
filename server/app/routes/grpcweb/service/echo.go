package service

import (
	"___TEMPLATE_REPO_URL___/app/routes/grpcweb/service/proto"
	"context"
	"fmt"
	"io"

	"github.com/corioders/gokit/errors"
)

type echo struct {
	proto.UnimplementedEchoServiceServer
}

func newEcho() (*echo, error) {
	return &echo{}, nil
}

func (echo) Echo(ctx context.Context, req *proto.EchoRequest) (*proto.EchoResponse, error) {
	select {
	case <-ctx.Done():
		return nil, ctx.Err()

	default:
	}

	reqMessage := req.GetMessage()
	return &proto.EchoResponse{Message: "Working, got data: " + reqMessage}, nil
}

func (echo) EchoServerStream(req *proto.EchoRequest, stream proto.EchoService_EchoServerStreamServer) error {
	reqMessage := req.GetMessage()
	for i := 0; i < 10; i++ {
		select {
		case <-stream.Context().Done():
			return nil
		default:
		}

		err := stream.Send(&proto.EchoResponse{Message: fmt.Sprintf("Working, got data: %s, iteration: %v", reqMessage, i)})
		if err != nil {
			return err
		}
	}

	return nil
}

func (echo) EchoClientStream(req proto.EchoService_EchoClientStreamServer) error {
	msg := "Working, got data: "

	for {
		select {
		case <-req.Context().Done():
			return nil
		default:
		}

		request, err := req.Recv()
		if err != nil {
			if errors.Is(err, io.EOF) {
				break
			}
			return err
		}

		msg += request.GetMessage() + "  "
	}

	return req.SendAndClose(&proto.EchoResponse{Message: msg})
}

func (echo) EchoBidirectionalStream(stream proto.EchoService_EchoBidirectionalStreamServer) error {
	i := 0
	for {
		select {
		case <-stream.Context().Done():
			return nil
		default:
		}

		req, err := stream.Recv()
		if err != nil {
			if errors.Is(err, io.EOF) {
				break
			}
			return err
		}

		message := req.GetMessage()
		err = stream.Send(&proto.EchoResponse{Message: fmt.Sprintf("Working, got data: %s, iteration: %v", message, i)})
		if err != nil {
			return err
		}

		i++
	}

	return nil
}
