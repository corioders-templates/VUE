package foundation

import (
	"github.com/corioders/gokit/application"
	"github.com/corioders/gokit/log"
)

type Application struct {
	*application.Application
	config *Config
}

func NewApplication(logger log.Logger, config *Config) *Application {
	return &Application{
		Application: application.New(logger),
		config:      config,
	}
}

func (a *Application) GetConfig() *Config {
	return a.config
}
