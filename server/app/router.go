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

	v1 := router.NewGroup("/v1")
	// =========================================================================
	// grpcweb

	grpcwebHandlerFactory, err := grpcweb.NewHandler(app)
	if err != nil {
		return nil, err
	}
	v1.HandleAll("/grpcweb/*", grpcwebHandlerFactory("/grpcweb/"))

	// =========================================================================
	// testRoute

	testRouteHandler, err := testRoute.NewHandler()
	if err != nil {
		return nil, err
	}

	testRouteLogin, testRouteVerify, err := testRoute.NewAccesscontrol()
	if err != nil {
		return nil, err
	}

	v1.Handle("GET", "/testRouteLogin", testRouteLogin)
	v1.Handle("GET", "/testRoute", testRouteHandler, testRouteVerify)

	return router, nil
}
