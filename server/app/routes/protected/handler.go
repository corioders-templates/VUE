package protected

import (
	"context"
	"net/http"

	"github.com/corioders/gokit/web"
)

func NewHandler() (web.Handler, error) {
	return func(ctx context.Context, rw http.ResponseWriter, _ *http.Request) error {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		_, err := rw.Write([]byte("<h1>Protected content!</h1>"))
		if err != nil {
			return err
		}

		return nil
	}, nil
}
