package grpcweb

import (
	"___TEMPLATE_REPO_URL___/app/routes/grpcweb/service"
	"___TEMPLATE_REPO_URL___/foundation"
	"context"
	"net/http"

	"github.com/corioders/gokit/errors"
	"github.com/corioders/gokit/web"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func newGrpcwebHandler(app *foundation.Application) (web.Handler, error) {
	grpcServer := grpc.NewServer(
		grpc.ChainUnaryInterceptor(unaryErrorReporter),
		grpc.ChainStreamInterceptor(streamErrorReporter),
	)

	app.StopFunc("grpcweb", func() error {
		grpcServer.GracefulStop()
		return nil
	})

	wrappedGrpcServer := grpcweb.WrapServer(grpcServer,
		grpcweb.WithWebsocketOriginFunc(allowAllOrigins),
		grpcweb.WithWebsockets(true),
	)

	err := service.Register(grpcServer)
	if err != nil {
		return nil, err
	}

	// TODO: check if this is ok that we are ignoring ctx
	return func(ctx context.Context, rw http.ResponseWriter, r *http.Request) (err error) {
		//! watch out for grpc or grpcweb version change
		//! because now we are assuming that everything is happening on one goroutine

		// wg := sync.WaitGroup{}
		// wg.Add(1)
		doneReporter := func() {
			// wg.Done()
		}

		errorReporter := func(innerErr error) {
			err = innerErr
		}

		var panicValue interface{}
		panicReporter := func(innerPanicValue interface{}) {
			panicValue = innerPanicValue
		}

		requestCtx := context.WithValue(r.Context(), doneReporterFuncKey, doneReporterFunc(doneReporter))
		requestCtx = context.WithValue(requestCtx, errorReporterFuncKey, errorReporterFunc(errorReporter))
		requestCtx = context.WithValue(requestCtx, panicReporterFuncKey, panicReporterFunc(panicReporter))
		r = r.WithContext(requestCtx)

		wrappedGrpcServer.ServeHTTP(rw, r)
		// wg.Wait()

		if panicValue != nil {
			panic(panicValue)
		}

		if err != nil {
			if errors.Is(err, context.Canceled) {
				return nil
			}

			if status, ok := status.FromError(err); ok && status.Code() == codes.Canceled {
				return nil
			}
		}

		return err
	}, nil
}

func allowAllOrigins(req *http.Request) bool {
	return true
}

type ctxKey uint

const (
	doneReporterFuncKey ctxKey = iota
	errorReporterFuncKey
	panicReporterFuncKey
)

type doneReporterFunc func()
type errorReporterFunc func(error)
type panicReporterFunc func(interface{})

func getReporters(ctx context.Context) (doneReporterFunc, errorReporterFunc, panicReporterFunc) {
	doneReporter := ctx.Value(doneReporterFuncKey).(doneReporterFunc)
	errorReporter := ctx.Value(errorReporterFuncKey).(errorReporterFunc)
	panicReporter := ctx.Value(panicReporterFuncKey).(panicReporterFunc)
	return doneReporter, errorReporter, panicReporter
}

func unaryErrorReporter(ctx context.Context, req interface{}, _ *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
	doneReporter, errorReporter, panicReporter := getReporters(ctx)

	defer func() {
		r := recover()
		if r != nil {
			panicReporter(r)
		}
	}()
	resp, err := handler(ctx, req)
	if err != nil {
		errorReporter(err)
	}
	doneReporter()

	return resp, err
}

func streamErrorReporter(srv interface{}, ss grpc.ServerStream, _ *grpc.StreamServerInfo, handler grpc.StreamHandler) error {
	doneReporter, errorReporter, panicReporter := getReporters(ss.Context())

	defer func() {
		r := recover()
		if r != nil {
			panicReporter(r)
		}
	}()
	err := handler(srv, ss)
	if err != nil {
		errorReporter(err)
	}
	doneReporter()

	return err
}
