package grpcweb

import (
	"___TEMPLATE_REPO_URL___/foundation"
	"context"
	"net/http"
	"strings"

	"github.com/corioders/gokit/web"
)

func NewHandler(app *foundation.Application) (func(urlPrefix string) web.Handler, error) {
	handler, err := newGrpcwebHandler(app)
	if err != nil {
		return nil, err
	}

	return func(urlPrefix string) web.Handler {
		return func(ctx context.Context, rw http.ResponseWriter, r *http.Request) error {
			// Remove prefix from url path, because grpc will use path to match correct service.
			r.URL.Path = strings.ReplaceAll(r.URL.Path, urlPrefix, "/")
			rw.Header().Set("Access-Control-Allow-Headers ", "content-type, x-grpc-web")

			return handler(ctx, rw, r)
		}
	}, nil
}
