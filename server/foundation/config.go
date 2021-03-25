package foundation

import (
	gokitconfig "github.com/corioders/gokit/config"
)

type Config struct {
	Host string `yaml:"host"`
}

func (c *Config) validate() error {
	return nil
}

func LoadConfig(path string) (*Config, error) {
	config := &Config{}

	err := gokitconfig.Load(path, config)
	if err != nil {
		return nil, err
	}

	err = config.validate()
	if err != nil {
		return nil, err
	}

	return config, nil
}
