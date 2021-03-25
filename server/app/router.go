package main

import (
	"___TEMPLATE_REPO_URL___/app/routes/grpcweb"
	"___TEMPLATE_REPO_URL___/app/routes/testRoute"
	"___TEMPLATE_REPO_URL___/foundation"
	"net/http"

	"github.com/corioders/gokit/web"
	"github.com/corioders/gokit/web/middleware"
)

func newRouter(app *foundation.Application) (http.Handler, error) {
	routerLogger := app.GetLogger().Child("Router")
	router := web.NewRouter(app.GetLogger(),
		middleware.Errors(app.GetLogger()),
		middleware.Compression(),
		middleware.Cors(app.GetConfig().Host),
	)
	_ = routerLogger

	grpcwebHandlerFactory, err := grpcweb.NewHandler(app)
	if err != nil {
		return nil, err
	}
	router.HandleAll("/v1/grpcweb/*", grpcwebHandlerFactory("/v1/grpcweb/"))

	testRouteHandler, err := testRoute.NewHandler(app)
	if err != nil {
		return nil, err
	}
	router.Handle("GET", "/v1/testRoute", testRouteHandler)

	return router, nil
}
