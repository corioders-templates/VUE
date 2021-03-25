package main

import (
	"___TEMPLATE_REPO_URL___/foundation"
	"net/http"
	"os"
	"time"

	"github.com/corioders/gokit/constant"
	"github.com/corioders/gokit/log"
)

func main() {
	err := run()
	if err != nil {
		panic(err)
	}
}

func run() error {
	logger := log.New(os.Stdout, "___TEMPLATE_PROJECT_NAME___")

	config, err := foundation.LoadConfig("./config.yml")
	if err != nil {
		return err
	}

	app := foundation.NewApplication(logger, config)

	if constant.IsProduction {
		err = foundation.StartTelemetry(app)
		if err != nil {
			return err
		}
	}

	router, err := newRouter(app)
	if err != nil {
		return err
	}

	server := http.Server{
		ReadTimeout:  time.Second * 10,
		WriteTimeout: time.Second * 10,
		IdleTimeout:  time.Second * 10,
		Addr:         ":3000",
		Handler:      router,
	}

	err = server.ListenAndServe()
	if err != nil {
		return err
	}

	// err = app.Stop()
	// if err != nil {
	// 	return err
	// }

	return nil
}
