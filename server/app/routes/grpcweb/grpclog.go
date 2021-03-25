package grpcweb

import "google.golang.org/grpc/grpclog"

func init() {
	// Disable grpc logging.
	grpclog.SetLoggerV2(nilGrpcLoggerV2{})
}

type nilGrpcLoggerV2 struct{}

func (nilGrpcLoggerV2) Info(args ...interface{})                    {}
func (nilGrpcLoggerV2) Infoln(args ...interface{})                  {}
func (nilGrpcLoggerV2) Infof(format string, args ...interface{})    {}
func (nilGrpcLoggerV2) Warning(args ...interface{})                 {}
func (nilGrpcLoggerV2) Warningln(args ...interface{})               {}
func (nilGrpcLoggerV2) Warningf(format string, args ...interface{}) {}
func (nilGrpcLoggerV2) Error(args ...interface{})                   {}
func (nilGrpcLoggerV2) Errorln(args ...interface{})                 {}
func (nilGrpcLoggerV2) Errorf(format string, args ...interface{})   {}
func (nilGrpcLoggerV2) Fatal(args ...interface{})                   {}
func (nilGrpcLoggerV2) Fatalln(args ...interface{})                 {}
func (nilGrpcLoggerV2) Fatalf(format string, args ...interface{})   {}
func (nilGrpcLoggerV2) V(l int) bool {
	return false
}
