package testRoute

import (
	"___TEMPLATE_REPO_URL___/foundation"
	"context"
	"net/http"

	"github.com/corioders/gokit/web"
)

func NewHandler(app *foundation.Application) (web.Handler, error) {

	return func(ctx context.Context, rw http.ResponseWriter, r *http.Request) error {
		select {
		case <-ctx.Done():
			return nil
		default:
		}

		_, err := rw.Write([]byte("<h1>test</h1>"))
		if err != nil {
			return err
		}

		return nil
	}, nil
}
