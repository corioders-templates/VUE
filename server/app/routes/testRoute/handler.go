package testRoute

import (
	"context"
	"net/http"

	"github.com/corioders/gokit/web"
)

func NewHandler() (web.Handler, error) {
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
